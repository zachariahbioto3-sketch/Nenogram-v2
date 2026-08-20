from rest_framework import serializers
from .models import Post, Like, Follow, Comment, Notification

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    author_display = serializers.CharField(source='author.display_name', read_only=True)
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_own = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'author_username', 'author_display', 'content', 'image', 'like_count', 'comment_count', 'is_liked', 'is_own', 'is_following', 'created_at']
        read_only_fields = ['id', 'author_username', 'author_display', 'like_count', 'comment_count', 'is_liked', 'is_own', 'is_following', 'created_at']

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

    def get_is_own(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.author == request.user
        return False

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Follow.objects.filter(follower=request.user, following=obj.author).exists()
        return False


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following', 'created_at']


class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    author_display = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'author_username', 'author_display', 'content', 'created_at']
        read_only_fields = ['id', 'author_username', 'author_display', 'created_at']

    def get_author_display(self, obj):
        return obj.author.display_name or obj.author.username

class NotificationSerializer(serializers.ModelSerializer):
    actor_username = serializers.CharField(source='actor.username', read_only=True)
    actor_display = serializers.SerializerMethodField()
    post_id = serializers.IntegerField(source='post.id', read_only=True, allow_null=True)

    class Meta:
        model = Notification
        fields = ['id', 'actor_username', 'actor_display', 'notif_type', 'post_id', 'is_read', 'created_at']
        read_only_fields = fields

    def get_actor_display(self, obj):
        return obj.actor.display_name or obj.actor.username