from rest_framework import serializers
from .models import Gig, GigCategory

class GigCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GigCategory
        fields = ['id', 'name', 'slug']


class GigDeveloperSerializer(serializers.Serializer):
    id = serializers.IntegerField(source='pk')
    username = serializers.CharField()
    display_name = serializers.CharField()
    tagline = serializers.SerializerMethodField()
    is_available = serializers.SerializerMethodField()

    def get_tagline(self, obj):
        if hasattr(obj, 'developer_profile'):
            return obj.developer_profile.tagline
        return ''

    def get_is_available(self, obj):
        if hasattr(obj, 'developer_profile'):
            return obj.developer_profile.is_available
        return False


class GigSerializer(serializers.ModelSerializer):
    developer = GigDeveloperSerializer(read_only=True)
    category = GigCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=GigCategory.objects.all(), source='category', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Gig
        fields = ['id', 'developer', 'category', 'category_id', 'title', 'description', 'price', 'delivery_days', 'tags', 'is_active', 'created_at']
        read_only_fields = ['id', 'developer', 'created_at']


class CreateGigSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=GigCategory.objects.all(), source='category', required=False, allow_null=True
    )

    class Meta:
        model = Gig
        fields = ['title', 'description', 'price', 'delivery_days', 'tags', 'category_id']

    def create(self, validated_data):
        user = self.context['request'].user
        return Gig.objects.create(developer=user, **validated_data)
