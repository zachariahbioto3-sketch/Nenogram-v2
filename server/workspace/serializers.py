from rest_framework import serializers
from .models import WorkspaceFolder, WorkspaceFile


class WorkspaceFolderSerializer(serializers.ModelSerializer):
    file_count = serializers.SerializerMethodField()

    class Meta:
        model = WorkspaceFolder
        fields = ['id', 'name', 'parent', 'file_count', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_file_count(self, obj):
        return obj.file_count


class WorkspaceFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkspaceFile
        fields = ['id', 'name', 'folder', 'file_type', 'language', 'content', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class WorkspaceFileListSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkspaceFile
        fields = ['id', 'name', 'folder', 'file_type', 'language', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
