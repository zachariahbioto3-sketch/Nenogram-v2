from rest_framework import serializers
from .models import Category, Gig, GigOrder, Job, Bid, Contract, Milestone, MilestoneSubmission, Dispute
from accounts.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


# ─── GIG ─────────────────────────────────────────────────────────────────────

class GigSerializer(serializers.ModelSerializer):
    developer = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True, required=False
    )

    class Meta:
        model = Gig
        fields = [
            "id", "developer", "category", "category_id", "title",
            "description", "price", "currency_type", "delivery_days",
            "tags", "is_active", "created_at",
        ]
        read_only_fields = ["id", "developer", "created_at"]

    def create(self, validated_data):
        validated_data["developer"] = self.context["request"].user
        return super().create(validated_data)


class GigOrderSerializer(serializers.ModelSerializer):
    gig = GigSerializer(read_only=True)
    client = UserSerializer(read_only=True)

    class Meta:
        model = GigOrder
        fields = [
            "id", "gig", "client", "requirements", "amount",
            "currency_type", "status", "created_at", "delivered_at", "completed_at",
        ]
        read_only_fields = ["id", "client", "amount", "currency_type", "status", "created_at"]


# ─── JOB ─────────────────────────────────────────────────────────────────────

class JobSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    bid_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            "id", "client", "title", "description", "category",
            "skills_required", "budget_min", "budget_max", "currency_type",
            "deadline", "status", "bid_count", "created_at",
        ]
        read_only_fields = ["id", "client", "status", "created_at"]

    def get_bid_count(self, obj):
        return obj.bids.count()

    def create(self, validated_data):
        validated_data["client"] = self.context["request"].user
        return super().create(validated_data)


class BidSerializer(serializers.ModelSerializer):
    developer = UserSerializer(read_only=True)

    class Meta:
        model = Bid
        fields = [
            "id", "job", "developer", "amount", "currency_type",
            "timeline_days", "cover_letter", "proposed_milestones",
            "status", "created_at",
        ]
        read_only_fields = ["id", "developer", "status", "created_at"]

    def create(self, validated_data):
        validated_data["developer"] = self.context["request"].user
        return super().create(validated_data)


# ─── CONTRACT + MILESTONE ────────────────────────────────────────────────────

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = [
            "id", "title", "description", "amount", "currency_type",
            "order", "status", "due_date", "submitted_at", "approved_at",
        ]
        read_only_fields = ["id", "status", "submitted_at", "approved_at"]


class ContractSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    developer = UserSerializer(read_only=True)
    milestones = MilestoneSerializer(many=True, read_only=True)

    class Meta:
        model = Contract
        fields = [
            "id", "client", "developer", "source", "title",
            "total_amount", "currency_type", "status",
            "milestones", "created_at", "completed_at",
        ]
        read_only_fields = ["id", "client", "developer", "source", "status", "created_at"]


class MilestoneSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MilestoneSubmission
        fields = ["id", "milestone", "note", "attachments", "created_at"]
        read_only_fields = ["id", "created_at"]


class DisputeSerializer(serializers.ModelSerializer):
    raised_by = UserSerializer(read_only=True)

    class Meta:
        model = Dispute
        fields = [
            "id", "contract", "milestone", "raised_by", "reason",
            "status", "resolution", "created_at", "resolved_at",
        ]
        read_only_fields = ["id", "raised_by", "status", "resolution", "resolved_at", "created_at"]

    def create(self, validated_data):
        validated_data["raised_by"] = self.context["request"].user
        return super().create(validated_data)
