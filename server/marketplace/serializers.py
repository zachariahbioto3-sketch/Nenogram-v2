from rest_framework import serializers
from .models import Gig, GigCategory, Job, Bid

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


class BidSerializer(serializers.ModelSerializer):
    developer_email = serializers.EmailField(source='developer.email', read_only=True)
    developer_name = serializers.SerializerMethodField()

    class Meta:
        model = Bid
        fields = [
            'id', 'job', 'developer', 'developer_email', 'developer_name',
            'amount', 'timeline_days', 'cover_letter', 'status', 'created_at',
        ]
        read_only_fields = ['id', 'developer', 'status', 'created_at']

    def get_developer_name(self, obj):
        full_name = obj.developer.get_full_name()
        return full_name if full_name else obj.developer.email

    def validate_cover_letter(self, value):
        if len(value.strip()) < 50:
            raise serializers.ValidationError('Cover letter must be at least 50 characters.')
        return value


class JobSerializer(serializers.ModelSerializer):
    bid_count = serializers.IntegerField(read_only=True, required=False)
    client_email = serializers.EmailField(source='client.email', read_only=True)

    class Meta:
        model = Job
        fields = [
            'id', 'client', 'client_email', 'title', 'description', 'category',
            'skills_required', 'budget_min', 'budget_max', 'deadline', 'status',
            'bid_count', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'client', 'status', 'created_at', 'updated_at']