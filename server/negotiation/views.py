from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .models import NegotiationRoom
from .serializers import NegotiationRoomSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_room(request, room_id):
    try:
        room = NegotiationRoom.objects.prefetch_related("milestones", "messages").get(id=room_id)
    except NegotiationRoom.DoesNotExist:
        return Response({"detail": "Room not found"}, status=status.HTTP_404_NOT_FOUND)
    if request.user not in [room.client, room.developer]:
        return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    return Response(NegotiationRoomSerializer(room, context={"request": request}).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_rooms(request):
    rooms = NegotiationRoom.objects.filter(Q(client=request.user) | Q(developer=request.user)).order_by("-created_at")
    return Response(NegotiationRoomSerializer(rooms, many=True, context={"request": request}).data)
