import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import NegotiationRoom, NegotiationMilestone, Message
from marketplace.models import Milestone


class NegotiationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group = f"negotiation_{self.room_id}"
        self.user = self.scope["user"]

        if not self.user.is_authenticated:
            await self.close()
            return

        if not await self.check_access():
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group, self.channel_name)
        await self.accept()
        room_data = await self.get_room_state()
        await self.send(text_data=json.dumps({"type": "room.state", "data": room_data}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        handlers = {
            "chat.message": self.handle_chat_message,
            "milestone.add": self.handle_milestone_add,
            "milestone.update": self.handle_milestone_update,
            "milestone.delete": self.handle_milestone_delete,
            "room.confirm": self.handle_room_confirm,
        }
        handler = handlers.get(data.get("type"))
        if handler:
            await handler(data)

    async def handle_chat_message(self, data):
        message = await self.save_message(data)
        await self.channel_layer.group_send(self.room_group, {"type": "broadcast.message", "payload": {"type": "chat.message", "message": message}})

    async def handle_milestone_add(self, data):
        milestone = await self.create_milestone(data)
        await self.channel_layer.group_send(self.room_group, {"type": "broadcast.message", "payload": {"type": "milestone.added", "milestone": milestone}})

    async def handle_milestone_update(self, data):
        milestone = await self.update_milestone(data)
        if milestone:
            await self.channel_layer.group_send(self.room_group, {"type": "broadcast.message", "payload": {"type": "milestone.updated", "milestone": milestone}})

    async def handle_milestone_delete(self, data):
        deleted = await self.delete_milestone(data.get("milestone_id"))
        if deleted:
            await self.channel_layer.group_send(self.room_group, {"type": "broadcast.message", "payload": {"type": "milestone.deleted", "milestone_id": data.get("milestone_id")}})

    async def handle_room_confirm(self, data):
        result = await self.confirm_room()
        await self.channel_layer.group_send(self.room_group, {"type": "broadcast.message", "payload": {"type": "room.confirmed", "data": result}})

    async def broadcast_message(self, event):
        await self.send(text_data=json.dumps(event["payload"]))

    @database_sync_to_async
    def check_access(self):
        try:
            room = NegotiationRoom.objects.get(id=self.room_id)
            return self.user in [room.client, room.developer]
        except NegotiationRoom.DoesNotExist:
            return False

    @database_sync_to_async
    def get_room_state(self):
        room = NegotiationRoom.objects.prefetch_related("milestones", "messages__sender").get(id=self.room_id)
        return {
            "room_id": str(room.id),
            "status": room.status,
            "client_confirmed": room.client_confirmed,
            "developer_confirmed": room.developer_confirmed,
            "milestones": [{"id": str(m.id), "title": m.title, "description": m.description, "amount": str(m.amount), "order": m.order, "due_days": m.due_days} for m in room.milestones.all()],
            "messages": [{"id": str(m.id), "sender": m.sender.username if m.sender else "system", "message_type": m.message_type, "content": m.content, "file_url": m.file_url, "created_at": m.created_at.isoformat()} for m in room.messages.all()],
        }

    @database_sync_to_async
    def save_message(self, data):
        room = NegotiationRoom.objects.get(id=self.room_id)
        msg = Message.objects.create(room=room, sender=self.user, message_type=data.get("message_type", "text"), content=data.get("content", ""), file_url=data.get("file_url", ""), file_name=data.get("file_name", ""))
        return {"id": str(msg.id), "sender": self.user.username, "message_type": msg.message_type, "content": msg.content, "file_url": msg.file_url, "created_at": msg.created_at.isoformat()}

    @database_sync_to_async
    def create_milestone(self, data):
        room = NegotiationRoom.objects.get(id=self.room_id)
        if room.status != "open":
            return None
        m = NegotiationMilestone.objects.create(room=room, title=data.get("title", "New Step"), description=data.get("description", ""), amount=data.get("amount", 0), order=room.milestones.count() + 1, due_days=data.get("due_days", 7))
        return {"id": str(m.id), "title": m.title, "description": m.description, "amount": str(m.amount), "order": m.order, "due_days": m.due_days}

    @database_sync_to_async
    def update_milestone(self, data):
        try:
            m = NegotiationMilestone.objects.get(id=data.get("milestone_id"), room__id=self.room_id)
            if m.room.status != "open":
                return None
            m.title = data.get("title", m.title)
            m.description = data.get("description", m.description)
            m.amount = data.get("amount", m.amount)
            m.due_days = data.get("due_days", m.due_days)
            m.save()
            return {"id": str(m.id), "title": m.title, "description": m.description, "amount": str(m.amount), "order": m.order, "due_days": m.due_days}
        except NegotiationMilestone.DoesNotExist:
            return None

    @database_sync_to_async
    def delete_milestone(self, milestone_id):
        try:
            m = NegotiationMilestone.objects.get(id=milestone_id, room__id=self.room_id)
            if m.room.status != "open":
                return False
            m.delete()
            return True
        except NegotiationMilestone.DoesNotExist:
            return False

    @database_sync_to_async
    def confirm_room(self):
        room = NegotiationRoom.objects.get(id=self.room_id)
        if room.status != "open":
            return {"status": room.status, "client_confirmed": room.client_confirmed, "developer_confirmed": room.developer_confirmed}
        if self.user == room.client:
            room.client_confirmed = True
        elif self.user == room.developer:
            room.developer_confirmed = True
        room.save()
        if room.both_confirmed():
            room.status = "locked"
            room.save()
            if room.contract:
                room.contract.milestones.all().delete()
                for nm in room.milestones.all():
                    Milestone.objects.create(contract=room.contract, title=nm.title, description=nm.description, amount=nm.amount, order=nm.order)
            Message.objects.create(room=room, sender=None, message_type="system", content="Both parties confirmed. Contract is now active.")
        return {"status": room.status, "client_confirmed": room.client_confirmed, "developer_confirmed": room.developer_confirmed}
