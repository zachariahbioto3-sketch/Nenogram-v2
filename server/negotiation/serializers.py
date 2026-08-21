from rest_framework import serializers
from .models import NegotiationRoom, NegotiationMilestone, Message


class NegotiationMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = NegotiationMilestone
        fields = ["id", "title", "description", "amount", "order", "due_days", "updated_at"]


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source="sender.username", read_only=True)

    class Meta:
        model = Message
        fields = ["id", "sender", "sender_username", "message_type", "content", "file_url", "file_name", "created_at"]


class NegotiationRoomSerializer(serializers.ModelSerializer):
    milestones = NegotiationMilestoneSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    client_username = serializers.CharField(source="client.username", read_only=True)
    developer_username = serializers.CharField(source="developer.username", read_only=True)

    class Meta:
        model = NegotiationRoom
        fields = ["id", "status", "client", "client_username", "developer", "developer_username", "client_confirmed", "developer_confirmed", "milestones", "messages", "created_at"]
