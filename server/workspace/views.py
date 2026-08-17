from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import WorkspaceFolder, WorkspaceFile
from .serializers import WorkspaceFolderSerializer, WorkspaceFileSerializer, WorkspaceFileListSerializer


class FolderListCreateView(generics.ListCreateAPIView):
    serializer_class = WorkspaceFolderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        parent = self.request.query_params.get('parent')
        qs = WorkspaceFolder.objects.filter(owner=self.request.user)
        if parent == 'null' or parent is None:
            qs = qs.filter(parent__isnull=True)
        else:
            qs = qs.filter(parent_id=parent)
        return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class FolderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WorkspaceFolderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WorkspaceFolder.objects.filter(owner=self.request.user)


class FileListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return WorkspaceFileListSerializer
        return WorkspaceFileSerializer

    def get_queryset(self):
        folder = self.request.query_params.get('folder')
        qs = WorkspaceFile.objects.filter(owner=self.request.user)
        if folder == 'null' or folder is None:
            qs = qs.filter(folder__isnull=True)
        else:
            qs = qs.filter(folder_id=folder)
        return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class FileDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WorkspaceFileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WorkspaceFile.objects.filter(owner=self.request.user)
