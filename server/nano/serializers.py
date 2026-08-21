from rest_framework import serializers
from django.utils import timezone
from .models import NanoFolder, NanoFile


class NanoFolderSerializer(serializers.ModelSerializer):
    file_count = serializers.SerializerMethodField()

    class Meta:
        model = NanoFolder
        fields = ['id', 'name', 'parent', 'file_count', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_file_count(self, obj):
        return obj.file_count


class NanoFileSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = NanoFile
        fields = [
            'id', 'name', 'folder', 'file_type', 'language', 'content',
            'visibility', 'is_published', 'published_at',
            'owner_username', 'created_at', 'updated_at',
        ]
        read_only_fields = ['owner_username', 'published_at', 'created_at', 'updated_at']


class NanoFileListSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = NanoFile
        fields = [
            'id', 'name', 'folder', 'file_type', 'language',
            'visibility', 'is_published', 'published_at',
            'owner_username', 'created_at', 'updated_at',
        ]
        read_only_fields = ['owner_username', 'published_at', 'created_at', 'updated_at']


class NanoFeedSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = NanoFile
        fields = [
            'id', 'name', 'file_type', 'language', 'content',
            'owner_username', 'published_at', 'updated_at',
        ]
        read_only_fields = fields
