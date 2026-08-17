from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import login as auth_login
from .models import User
from .serializers import (
    RegisterSerializer, LoginSerializer,
    UserSerializer, DeveloperUpgradeSerializer
)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'detail': 'Logged out successfully'})
    except TokenError:
        return Response({'detail': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upgrade_to_developer(request):
    serializer = DeveloperUpgradeSerializer(
        data=request.data,
        context={'request': request}
    )
    if serializer.is_valid():
        profile = serializer.save()
        return Response({
            'detail': 'Developer profile created',
            'developer_profile': {
                'skills': profile.skills,
                'hourly_rate': str(profile.hourly_rate),
                'tagline': profile.tagline,
                'is_available': profile.is_available,
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def public_profile(request, username):
    try:
        user = User.objects.select_related('developer_profile').get(username=username)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    from marketplace.models import Gig
    from marketplace.serializers import GigSerializer
    gigs = Gig.objects.filter(developer=user, is_active=True).select_related('category')[:12]
    return Response({
        'id': user.id,
        'username': user.username,
        'display_name': user.display_name,
        'bio': user.bio,
        'date_joined': user.date_joined,
        'is_developer': user.is_developer,
        'developer_profile': {
            'tagline': user.developer_profile.tagline,
            'skills': user.developer_profile.skills,
            'hourly_rate': str(user.developer_profile.hourly_rate),
            'portfolio_url': user.developer_profile.portfolio_url,
            'is_available': user.developer_profile.is_available,
        } if user.is_developer else None,
        'gigs': GigSerializer(gigs, many=True).data,
    })
