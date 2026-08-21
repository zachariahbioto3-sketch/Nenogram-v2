from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.utils import timezone
from .models import NanoFolder, NanoFile
from .serializers import (
    NanoFolderSerializer,
    NanoFileSerializer,
    NanoFileListSerializer,
    NanoFeedSerializer,
)


class FolderListCreateView(generics.ListCreateAPIView):
    serializer_class = NanoFolderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        parent = self.request.query_params.get('parent')
        qs = NanoFolder.objects.filter(owner=self.request.user)
        if parent is None or parent == 'null':
            qs = qs.filter(parent__isnull=True)
        else:
            qs = qs.filter(parent_id=parent)
        return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class FolderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NanoFolderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return NanoFolder.objects.filter(owner=self.request.user)


class FileListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return NanoFileListSerializer
        return NanoFileSerializer

    def get_queryset(self):
        folder = self.request.query_params.get('folder')
        qs = NanoFile.objects.filter(owner=self.request.user)
        if folder is None or folder == 'null':
            qs = qs.filter(folder__isnull=True)
        else:
            qs = qs.filter(folder_id=folder)
        return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class FileDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NanoFileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return NanoFile.objects.filter(owner=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def publish_file(request, pk):
    try:
        nano_file = NanoFile.objects.get(pk=pk, owner=request.user)
    except NanoFile.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if nano_file.visibility != 'public':
        return Response({'detail': 'File must be public to publish.'}, status=status.HTTP_400_BAD_REQUEST)
    nano_file.is_published = True
    nano_file.published_at = timezone.now()
    nano_file.save()
    return Response(NanoFileSerializer(nano_file).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unpublish_file(request, pk):
    try:
        nano_file = NanoFile.objects.get(pk=pk, owner=request.user)
    except NanoFile.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    nano_file.is_published = False
    nano_file.save()
    return Response(NanoFileSerializer(nano_file).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def nano_feed(request):
    files = NanoFile.objects.filter(
        visibility='public',
        is_published=True
    ).select_related('owner').order_by('-published_at')[:50]
    return Response(NanoFeedSerializer(files, many=True).data)
