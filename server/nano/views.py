from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.utils import timezone
from .models import NanoFolder, NanoFile, NanoInlineImage
from .serializers import (
    NanoFolderSerializer,
    NanoFileSerializer,
    NanoFileListSerializer,
    NanoFeedSerializer,
    NanoInlineImageSerializer,
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

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx

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

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx

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
    return Response(NanoFileSerializer(nano_file, context={'request': request}).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unpublish_file(request, pk):
    try:
        nano_file = NanoFile.objects.get(pk=pk, owner=request.user)
    except NanoFile.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    nano_file.is_published = False
    nano_file.save()
    return Response(NanoFileSerializer(nano_file, context={'request': request}).data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_thumbnail(request, pk):
    try:
        nano_file = NanoFile.objects.get(pk=pk, owner=request.user)
    except NanoFile.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    # Accept either a file upload or a URL string
    if 'thumbnail' in request.FILES:
        nano_file.thumbnail = request.FILES['thumbnail']
        nano_file.save()
    elif 'thumbnail_url' in request.data:
        import urllib.request
        import uuid, os
        from django.core.files.base import ContentFile
        url = request.data['thumbnail_url']
        try:
            with urllib.request.urlopen(url) as resp:
                ext = os.path.splitext(url.split('?')[0])[1] or '.jpg'
                nano_file.thumbnail.save(f'{uuid.uuid4()}{ext}', ContentFile(resp.read()), save=True)
        except Exception:
            return Response({'detail': 'Could not fetch image from URL.'}, status=status.HTTP_400_BAD_REQUEST)
    elif 'remove' in request.data:
        nano_file.thumbnail.delete(save=True)
    else:
        return Response({'detail': 'No thumbnail provided.'}, status=status.HTTP_400_BAD_REQUEST)

    return Response(NanoFileSerializer(nano_file, context={'request': request}).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_inline_image(request):
    if 'image' not in request.FILES:
        return Response({'detail': 'No image provided.'}, status=status.HTTP_400_BAD_REQUEST)
    img = NanoInlineImage.objects.create(owner=request.user, image=request.FILES['image'])
    return Response(NanoInlineImageSerializer(img, context={'request': request}).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([AllowAny])
def nano_feed(request):
    files = NanoFile.objects.filter(
        visibility='public',
        is_published=True
    ).select_related('owner').order_by('-published_at')[:50]
    return Response(NanoFeedSerializer(files, many=True, context={'request': request}).data)
