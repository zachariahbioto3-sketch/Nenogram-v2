from rest_framework import serializers
from django.utils import timezone
from .models import NanoFolder, NanoFile, NanoInlineImage


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
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = NanoFile
        fields = [
            'id', 'name', 'folder', 'file_type', 'language', 'content',
            'thumbnail', 'thumbnail_url',
            'visibility', 'is_published', 'published_at',
            'owner_username', 'created_at', 'updated_at',
        ]
        read_only_fields = ['owner_username', 'published_at', 'thumbnail_url', 'created_at', 'updated_at']

    def get_thumbnail_url(self, obj):
        if not obj.thumbnail:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.thumbnail.url)
        return obj.thumbnail.url


class NanoFileListSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = NanoFile
        fields = [
            'id', 'name', 'folder', 'file_type', 'language',
            'thumbnail_url',
            'visibility', 'is_published', 'published_at',
            'owner_username', 'created_at', 'updated_at',
        ]
        read_only_fields = ['owner_username', 'published_at', 'thumbnail_url', 'created_at', 'updated_at']

    def get_thumbnail_url(self, obj):
        if not obj.thumbnail:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.thumbnail.url)
        return obj.thumbnail.url


class NanoFeedSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = NanoFile
        fields = [
            'id', 'name', 'file_type', 'language', 'content',
            'thumbnail_url',
            'owner_username', 'published_at', 'updated_at',
        ]
        read_only_fields = fields

    def get_thumbnail_url(self, obj):
        if not obj.thumbnail:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.thumbnail.url)
        return obj.thumbnail.url


class NanoInlineImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = NanoInlineImage
        fields = ['id', 'url', 'uploaded_at']

    def get_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url
