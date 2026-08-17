from rest_framework import serializers
from .models import Hackathon, HackathonParticipant, Submission, SubmissionVote
from nano.models import Nano


class NanoMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nano
        fields = ['id', 'title', 'slug', 'language']


class HackathonSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    participant_count = serializers.SerializerMethodField()
    is_joined = serializers.SerializerMethodField()
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Hackathon
        fields = [
            'id', 'title', 'description', 'banner', 'prize', 'prize_currency',
            'start_at', 'end_at', 'created_by_username', 'created_at',
            'status', 'participant_count', 'is_joined'
        ]

    def get_status(self, obj):
        return obj.status

    def get_participant_count(self, obj):
        return obj.participant_count

    def get_is_joined(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return obj.participants.filter(user=request.user).exists()


class SubmissionSerializer(serializers.ModelSerializer):
    nano = NanoMiniSerializer(read_only=True)
    nano_id = serializers.PrimaryKeyRelatedField(
        queryset=Nano.objects.all(), source='nano', write_only=True, required=False, allow_null=True
    )
    participant_username = serializers.CharField(source='participant.username', read_only=True)
    participant_avatar = serializers.SerializerMethodField()
    vote_count = serializers.SerializerMethodField()
    has_voted = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = [
            'id', 'hackathon', 'participant_username', 'participant_avatar',
            'nano', 'nano_id', 'repo_url', 'description',
            'submitted_at', 'vote_count', 'has_voted'
        ]
        read_only_fields = ['hackathon', 'participant_username', 'submitted_at']

    def get_participant_avatar(self, obj):
        request = self.context.get('request')
        if obj.participant.avatar and request:
            return request.build_absolute_uri(obj.participant.avatar.url)
        return None

    def get_vote_count(self, obj):
        return obj.vote_count

    def get_has_voted(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return obj.votes.filter(voter=request.user).exists()

    def validate(self, data):
        nano = data.get('nano')
        repo_url = data.get('repo_url', '')
        if not nano and not repo_url:
            raise serializers.ValidationError('Provide either a Nano or a repo URL.')
        return data
