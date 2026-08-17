from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from accounts.models import User
from .models import Post, Like, Follow
from .serializers import PostSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def feed(request):
    following_ids = request.user.following.values_list('following_id', flat=True)
    posts = Post.objects.filter(
        author_id__in=list(following_ids) + [request.user.id]
    ).select_related('author')[:40]
    return Response(PostSerializer(posts, many=True, context={'request': request}).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def explore(request):
    posts = Post.objects.select_related('author')[:60]
    return Response(PostSerializer(posts, many=True, context={'request': request}).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    content = request.data.get('content', '').strip()
    if not content:
        return Response({'detail': 'Content required'}, status=status.HTTP_400_BAD_REQUEST)
    if len(content) > 280:
        return Response({'detail': 'Max 280 characters'}, status=status.HTTP_400_BAD_REQUEST)
    post = Post.objects.create(author=request.user, content=content)
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
    return Response({
        'following': following,
        'follower_count': target.followers.count(),
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def user_posts(request, username):
    user = get_object_or_404(User, username=username)
    posts = Post.objects.filter(author=user).select_related('author')[:40]
    return Response(PostSerializer(posts, many=True, context={'request': request}).data)
