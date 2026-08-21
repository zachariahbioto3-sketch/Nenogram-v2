import uuid
from django.db import models
from django.conf import settings
from marketplace.models import Bid, Contract


class NegotiationRoom(models.Model):
    STATUS_CHOICES = [
        ("open", "Open"),
        ("locked", "Locked"),
        ("closed", "Closed"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    bid = models.OneToOneField(Bid, on_delete=models.CASCADE, related_name="negotiation_room")
    contract = models.OneToOneField(Contract, on_delete=models.SET_NULL, null=True, blank=True, related_name="negotiation_room")
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="rooms_as_client")
    developer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="rooms_as_developer")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")
    client_confirmed = models.BooleanField(default=False)
    developer_confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Room {str(self.id)[:8]} - {self.status}"

    def both_confirmed(self):
        return self.client_confirmed and self.developer_confirmed


class NegotiationMilestone(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(NegotiationRoom, on_delete=models.CASCADE, related_name="milestones")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    order = models.PositiveIntegerField(default=0)
    due_days = models.PositiveIntegerField(default=7)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title


class Message(models.Model):
    TYPE_CHOICES = [
        ("text", "Text"),
        ("file", "File"),
        ("image", "Image"),
        ("system", "System"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(NegotiationRoom, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="negotiation_messages", null=True, blank=True)
    message_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default="text")
    content = models.TextField(blank=True)
    file_url = models.URLField(blank=True)
    file_name = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.sender} - {self.message_type}"
