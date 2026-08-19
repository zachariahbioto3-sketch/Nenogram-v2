from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Category, Gig, GigOrder, Job, Bid, Contract, Milestone, MilestoneSubmission, Dispute
from .serializers import (
    CategorySerializer, GigSerializer, GigOrderSerializer,
    JobSerializer, BidSerializer, ContractSerializer,
    MilestoneSerializer, MilestoneSubmissionSerializer, DisputeSerializer
)


# ─── CATEGORIES ──────────────────────────────────────────────────────────────

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


# ─── GIGS ────────────────────────────────────────────────────────────────────

class GigListCreateView(generics.ListCreateAPIView):
    serializer_class = GigSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Gig.objects.filter(is_active=True).select_related("developer", "category")
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__slug=category)
        return qs


class GigDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GigSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Gig.objects.select_related("developer", "category")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def order_gig(request, gig_id):
    gig = get_object_or_404(Gig, id=gig_id, is_active=True)
    if gig.developer == request.user:
        return Response({"detail": "Cannot order your own gig"}, status=status.HTTP_400_BAD_REQUEST)
    order = GigOrder.objects.create(
        gig=gig,
        client=request.user,
        requirements=request.data.get("requirements", ""),
        amount=gig.price,
        currency_type=gig.currency_type,
    )
    contract = Contract.objects.create(
        client=request.user,
        developer=gig.developer,
        source="gig",
        gig_order=order,
        title=gig.title,
        total_amount=gig.price,
        currency_type=gig.currency_type,
    )
    Milestone.objects.create(
        contract=contract,
        title="Delivery",
        amount=gig.price,
        currency_type=gig.currency_type,
        order=1,
    )
    return Response(GigOrderSerializer(order).data, status=status.HTTP_201_CREATED)


# ─── JOBS ────────────────────────────────────────────────────────────────────

class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Job.objects.filter(status="open").select_related("client")
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        return qs


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]
    queryset = Job.objects.select_related("client")


# ─── BIDS ────────────────────────────────────────────────────────────────────

class JobBidListView(generics.ListAPIView):
    serializer_class = BidSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        job = get_object_or_404(Job, id=self.kwargs["job_id"])
        if self.request.user != job.client:
            return Bid.objects.none()
        return Bid.objects.filter(job=job).select_related("developer")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def place_bid(request, job_id):
    job = get_object_or_404(Job, id=job_id, status="open")
    if job.client == request.user:
        return Response({"detail": "Cannot bid on your own job"}, status=status.HTTP_400_BAD_REQUEST)
    if Bid.objects.filter(job=job, developer=request.user).exists():
        return Response({"detail": "Already placed a bid"}, status=status.HTTP_400_BAD_REQUEST)
    serializer = BidSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        serializer.save(job=job)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def accept_bid(request, bid_id):
    bid = get_object_or_404(Bid, id=bid_id)
    job = bid.job
    if job.client != request.user:
        return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    if job.status != "open":
        return Response({"detail": "Job is no longer open"}, status=status.HTTP_400_BAD_REQUEST)
    bid.status = "accepted"
    bid.save()
    job.bids.exclude(id=bid.id).update(status="rejected")
    job.status = "in_progress"
    job.save()
    contract = Contract.objects.create(
        client=request.user,
        developer=bid.developer,
        source="job",
        job=job,
        title=job.title,
        total_amount=bid.amount,
        currency_type=bid.currency_type,
    )
    for i, m in enumerate(bid.proposed_milestones):
        Milestone.objects.create(
            contract=contract,
            title=m.get("title", "Milestone " + str(i + 1)),
            amount=m.get("amount", 0),
            currency_type=bid.currency_type,
            order=i + 1,
        )
    return Response(ContractSerializer(contract).data, status=status.HTTP_201_CREATED)


# ─── CONTRACTS ───────────────────────────────────────────────────────────────

class MyContractsView(generics.ListAPIView):
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Contract.objects.filter(
            __import__("django.db.models", fromlist=["Q"]).Q(client=user) |
            __import__("django.db.models", fromlist=["Q"]).Q(developer=user)
        ).select_related("client", "developer").prefetch_related("milestones")


class ContractDetailView(generics.RetrieveAPIView):
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        from django.db.models import Q
        return Contract.objects.filter(
            Q(client=user) | Q(developer=user)
        ).prefetch_related("milestones")


# ─── MILESTONES ──────────────────────────────────────────────────────────────

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_milestone(request, milestone_id):
    milestone = get_object_or_404(Milestone, id=milestone_id)
    if milestone.contract.developer != request.user:
        return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    if milestone.status not in ["pending", "in_progress"]:
        return Response({"detail": "Milestone cannot be submitted"}, status=status.HTTP_400_BAD_REQUEST)
    MilestoneSubmission.objects.create(
        milestone=milestone,
        note=request.data.get("note", ""),
        attachments=request.data.get("attachments", []),
    )
    milestone.status = "submitted"
    milestone.submitted_at = timezone.now()
    milestone.save()
    return Response({"detail": "Milestone submitted"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def approve_milestone(request, milestone_id):
    milestone = get_object_or_404(Milestone, id=milestone_id)
    if milestone.contract.client != request.user:
        return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    if milestone.status != "submitted":
        return Response({"detail": "Milestone not submitted yet"}, status=status.HTTP_400_BAD_REQUEST)
    milestone.status = "approved"
    milestone.approved_at = timezone.now()
    milestone.save()
    return Response({"detail": "Milestone approved — payment released"})


# ─── DISPUTES ────────────────────────────────────────────────────────────────

class DisputeCreateView(generics.CreateAPIView):
    serializer_class = DisputeSerializer
    permission_classes = [IsAuthenticated]

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def reject_bid(request, bid_id):
    bid = get_object_or_404(Bid, id=bid_id)
    if bid.job.client != request.user:
        return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    if bid.status != "pending":
        return Response({"detail": "Bid cannot be rejected"}, status=status.HTTP_400_BAD_REQUEST)
    bid.status = "rejected"
    bid.save()
    return Response({"detail": "Bid rejected"})