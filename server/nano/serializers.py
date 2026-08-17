from rest_framework import serializers
from .models import Nano

class NanoSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = Nano
        fields = ['id', 'slug', 'title', 'content', 'language', 'visibility', 'owner_username', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'owner_username', 'created_at', 'updated_at']


class NanoListSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = Nano
        fields = ['id', 'slug', 'title', 'language', 'visibility', 'owner_username', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'owner_username', 'created_at', 'updated_at']
