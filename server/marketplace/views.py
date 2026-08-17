from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Gig, GigCategory
from .serializers import GigSerializer, CreateGigSerializer, GigCategorySerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def gig_list(request):
    gigs = Gig.objects.filter(is_active=True).select_related('developer', 'developer__developer_profile', 'category')
    search = request.query_params.get('search')
    category = request.query_params.get('category')
    if search:
        gigs = gigs.filter(title__icontains=search)
    if category:
        gigs = gigs.filter(category__slug=category)
    serializer = GigSerializer(gigs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def gig_detail(request, pk):
    try:
        gig = Gig.objects.select_related('developer', 'developer__developer_profile', 'category').get(pk=pk, is_active=True)
    except Gig.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response(GigSerializer(gig).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def gig_create(request):
    if not request.user.is_developer:
        return Response({'detail': 'Developer profile required'}, status=status.HTTP_403_FORBIDDEN)
    serializer = CreateGigSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        gig = serializer.save()
        return Response(GigSerializer(gig).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def category_list(request):
    categories = GigCategory.objects.all()
    return Response(GigCategorySerializer(categories, many=True).data)
