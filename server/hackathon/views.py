from django.utils import timezone
from django.db import models as django_models
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Hackathon, HackathonParticipant, Submission, SubmissionVote
from .serializers import HackathonSerializer, SubmissionSerializer


class HackathonListView(generics.ListAPIView):
    serializer_class = HackathonSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        status_filter = self.request.query_params.get('status')
        now = timezone.now()
        qs = Hackathon.objects.all()
        if status_filter == 'upcoming':
            qs = qs.filter(start_at__gt=now)
        elif status_filter == 'active':
            qs = qs.filter(start_at__lte=now, end_at__gte=now)
        elif status_filter == 'ended':
            qs = qs.filter(end_at__lt=now)
        return qs

    def get_serializer_context(self):
        return {'request': self.request}


class HackathonDetailView(generics.RetrieveAPIView):
    queryset = Hackathon.objects.all()
    serializer_class = HackathonSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}


class JoinHackathonView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            hackathon = Hackathon.objects.get(pk=pk)
        except Hackathon.DoesNotExist:
            return Response({'error': 'Hackathon not found.'}, status=status.HTTP_404_NOT_FOUND)
        if hackathon.status == 'ended':
            return Response({'error': 'Hackathon has ended.'}, status=status.HTTP_400_BAD_REQUEST)
        obj, created = HackathonParticipant.objects.get_or_create(
            hackathon=hackathon, user=request.user
        )
        if not created:
            return Response({'detail': 'Already joined.'}, status=status.HTTP_200_OK)
        return Response({'detail': 'Joined successfully.'}, status=status.HTTP_201_CREATED)


class SubmissionListView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        hackathon_id = self.kwargs['pk']
        return Submission.objects.filter(hackathon_id=hackathon_id).annotate(
            vote_total=django_models.Count('votes')
        ).order_by('-vote_total', '-submitted_at')

    def get_serializer_context(self):
        return {'request': self.request}


class SubmissionCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            hackathon = Hackathon.objects.get(pk=pk)
        except Hackathon.DoesNotExist:
            return Response({'error': 'Hackathon not found.'}, status=status.HTTP_404_NOT_FOUND)
        if hackathon.status != 'active':
            return Response({'error': 'Submissions only open during active hackathon.'}, status=status.HTTP_400_BAD_REQUEST)
        if not hackathon.participants.filter(user=request.user).exists():
            return Response({'error': 'Join the hackathon before submitting.'}, status=status.HTTP_403_FORBIDDEN)
        if Submission.objects.filter(hackathon=hackathon, participant=request.user).exists():
            return Response({'error': 'You have already submitted.'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = SubmissionSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(hackathon=hackathon, participant=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, submission_id):
        try:
            submission = Submission.objects.get(pk=submission_id)
        except Submission.DoesNotExist:
            return Response({'error': 'Submission not found.'}, status=status.HTTP_404_NOT_FOUND)
        if submission.participant == request.user:
            return Response({'error': 'Cannot vote on your own submission.'}, status=status.HTTP_400_BAD_REQUEST)
        vote, created = SubmissionVote.objects.get_or_create(
            submission=submission, voter=request.user
        )
        if not created:
            vote.delete()
            return Response({'detail': 'Vote removed.', 'has_voted': False})
        return Response({'detail': 'Voted.', 'has_voted': True}, status=status.HTTP_201_CREATED)
