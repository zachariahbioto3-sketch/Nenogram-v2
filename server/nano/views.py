from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Nano
from .serializers import NanoSerializer, NanoListSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def nano_list_create(request):
    if request.method == 'GET':
        nanos = Nano.objects.filter(owner=request.user)
        return Response(NanoListSerializer(nanos, many=True).data)
    serializer = NanoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(owner=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def nano_detail(request, slug):
    try:
        nano = Nano.objects.get(slug=slug)
    except Nano.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if nano.visibility == 'private' and nano.owner != request.user:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        return Response(NanoSerializer(nano).data)
    if nano.owner != request.user:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    if request.method == 'PUT':
        serializer = NanoSerializer(nano, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    nano.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([AllowAny])
def nano_public(request):
    nanos = Nano.objects.filter(visibility='public').select_related('owner')[:50]
    return Response(NanoListSerializer(nanos, many=True).data)
