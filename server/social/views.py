from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from django.shortcuts import get_object_or_404
from accounts.models import User
from .models import Post, Like, Follow, Comment, Notification, Hashtag, PostHashtag
from .serializers import PostSerializer, CommentSerializer, NotificationSerializer
from .utils import extract_hashtags, extract_mentions


class SocialPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 50


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def feed(request):
    following_ids = request.user.following.values_list('following_id', flat=True)
    posts = Post.objects.filter(
        author_id__in=list(following_ids) + [request.user.id]
    ).select_related('author').prefetch_related('post_hashtags__hashtag').order_by('-created_at')
    paginator = SocialPagination()
    page = paginator.paginate_queryset(posts, request)
    return paginator.get_paginated_response(PostSerializer(page, many=True, context={'request': request}).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def explore(request):
    posts = Post.objects.select_related('author').prefetch_related('post_hashtags__hashtag').order_by('-created_at')
    paginator = SocialPagination()
    page = paginator.paginate_queryset(posts, request)
    return paginator.get_paginated_response(PostSerializer(page, many=True, context={'request': request}).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    content = request.data.get('content', '').strip()
    if not content:
        return Response({'detail': 'Content required'}, status=status.HTTP_400_BAD_REQUEST)
    if len(content) > 280:
        return Response({'detail': 'Max 280 characters'}, status=status.HTTP_400_BAD_REQUEST)
    image = request.FILES.get('image', None)
    post = Post.objects.create(author=request.user, content=content, image=image)

    for tag_name in extract_hashtags(content):
        tag, _ = Hashtag.objects.get_or_create(name=tag_name.lower())
        tag.post_count += 1
        tag.save(update_fields=['post_count'])
        PostHashtag.objects.get_or_create(post=post, hashtag=tag)

    for username in extract_mentions(content):
        mentioned = User.objects.filter(username=username).first()
        if mentioned and mentioned != request.user:
            Notification.objects.create(
                recipient=mentioned, actor=request.user,
                notif_type='mention', post=post
            )

    return Response(PostSerializer(post, context={'request': request}).data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if post.author != request.user:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    post.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, pk):
    post = get_object_or_404(Post, pk=pk)
    like = Like.objects.filter(user=request.user, post=post).first()
    if like:
        like.delete()
        liked = False
    else:
        Like.objects.create(user=request.user, post=post)
        liked = True
        if post.author != request.user:
            Notification.objects.get_or_create(
                recipient=post.author, actor=request.user,
                notif_type='like', post=post
            )
    return Response({'liked': liked, 'like_count': post.likes.count()})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_follow(request, username):
    target = get_object_or_404(User, username=username)
    if target == request.user:
        return Response({'detail': 'Cannot follow yourself'}, status=status.HTTP_400_BAD_REQUEST)
    follow = Follow.objects.filter(follower=request.user, following=target).first()
    if follow:
        follow.delete()
        following = False
    else:
        Follow.objects.create(follower=request.user, following=target)
        following = True
        Notification.objects.get_or_create(
            recipient=target, actor=request.user,
            notif_type='follow', post=None
        )
    return Response({'following': following, 'follower_count': target.followers.count()})


@api_view(['GET'])
@permission_classes([AllowAny])
def user_posts(request, username):
    user = get_object_or_404(User, username=username)
    posts = Post.objects.filter(author=user).select_related('author').prefetch_related('post_hashtags__hashtag').order_by('-created_at')
    paginator = SocialPagination()
    page = paginator.paginate_queryset(posts, request)
    return paginator.get_paginated_response(PostSerializer(page, many=True, context={'request': request}).data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def post_comments(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == 'GET':
        comments = Comment.objects.filter(post=post).select_related('author')
        paginator = SocialPagination()
        page = paginator.paginate_queryset(comments, request)
        return paginator.get_paginated_response(CommentSerializer(page, many=True).data)
    content = request.data.get('content', '').strip()
    if not content:
        return Response({'detail': 'Content required'}, status=status.HTTP_400_BAD_REQUEST)
    if len(content) > 500:
        return Response({'detail': 'Max 500 characters'}, status=status.HTTP_400_BAD_REQUEST)
    comment = Comment.objects.create(post=post, author=request.user, content=content)
    if post.author != request.user:
        Notification.objects.create(
            recipient=post.author, actor=request.user,
            notif_type='comment', post=post
        )
    return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_comment(request, pk):
    comment = get_object_or_404(Comment, pk=pk)
    if comment.author != request.user:
        return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    comment.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifications(request):
    notifs = Notification.objects.filter(recipient=request.user).select_related('actor', 'post')
    paginator = SocialPagination()
    page = paginator.paginate_queryset(notifs, request)
    return paginator.get_paginated_response(NotificationSerializer(page, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notifications_read(request):
    Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
    return Response({'status': 'ok'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_count(request):
    count = Notification.objects.filter(recipient=request.user, is_read=False).count()
    return Response({'count': count})
