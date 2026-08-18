from django.db import transaction
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from .models import Gig, GigCategory, Job, Bid
from .serializers import GigSerializer, CreateGigSerializer, GigCategorySerializer, JobSerializer, BidSerializer
from wallet.models import Wallet, Escrow
import uuid


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


class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Job.objects.filter(status=Job.STATUS_OPEN).annotate(bid_count=Count('bids'))
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('q')
        budget = self.request.query_params.get('budget')
        if category:
            qs = qs.filter(category=category)
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(description__icontains=search))
        if budget == 'low':
            qs = qs.filter(budget_max__lte=20000)
        elif budget == 'mid':
            qs = qs.filter(budget_min__gte=20000, budget_max__lte=100000)
        elif budget == 'high':
            qs = qs.filter(budget_min__gte=100000)
        return qs.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)


class JobDetailView(generics.RetrieveAPIView):
    queryset = Job.objects.annotate(bid_count=Count('bids'))
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]


class JobBidListCreateView(generics.ListCreateAPIView):
    serializer_class = BidSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_job(self):
        return get_object_or_404(Job, pk=self.kwargs['pk'])

    def get_queryset(self):
        job = self.get_job()
        if self.request.user == job.client:
            return job.bids.select_related('developer').order_by('-created_at')
        return job.bids.filter(developer=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        job = self.get_job()
        if not getattr(self.request.user, 'is_developer', False):
            raise PermissionDenied('Only developers can place bids.')
        if job.status != Job.STATUS_OPEN:
            raise PermissionDenied('This job is no longer open for bids.')
        if Bid.objects.filter(job=job, developer=self.request.user).exists():
            raise PermissionDenied('You have already placed a bid on this job.')
        serializer.save(job=job, developer=self.request.user)


class AcceptBidView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        bid = get_object_or_404(Bid.objects.select_related('job'), pk=pk)
        job = bid.job

        if request.user != job.client:
            return Response({'detail': 'Not your job posting.'}, status=status.HTTP_403_FORBIDDEN)
        if job.status != Job.STATUS_OPEN:
            return Response({'detail': 'Job is not open.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            client_wallet = Wallet.objects.get(user=request.user)
        except Wallet.DoesNotExist:
            return Response({'detail': 'Wallet not found.'}, status=status.HTTP_400_BAD_REQUEST)

        if client_wallet.real_balance < bid.amount:
            return Response({'detail': 'Insufficient wallet balance to fund escrow.'}, status=status.HTTP_400_BAD_REQUEST)

        bid.status = 'accepted'
        bid.save(update_fields=['status'])

        job.status = Job.STATUS_IN_PROGRESS
        job.save(update_fields=['status'])

        Bid.objects.filter(job=job).exclude(pk=bid.pk).update(status='rejected')

        client_wallet.real_balance -= bid.amount
        client_wallet.save(update_fields=['real_balance'])

        escrow = Escrow.objects.create(
            payer=request.user,
            payee=bid.developer,
            amount=bid.amount,
            currency_type='real',
            status='holding',
            reference=str(uuid.uuid4()),
        )

        return Response({
            'detail': 'Bid accepted, escrow funded.',
            'escrow_id': str(escrow.id),
        }, status=status.HTTP_200_OK)


class RejectBidView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        bid = get_object_or_404(Bid.objects.select_related('job'), pk=pk)
        if request.user != bid.job.client:
            return Response({'detail': 'Not your job posting.'}, status=status.HTTP_403_FORBIDDEN)
        bid.status = 'rejected'
        bid.save(update_fields=['status'])
        return Response({'detail': 'Bid rejected.'}, status=status.HTTP_200_OK)