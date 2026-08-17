from django.urls import path
from .views import (
    HackathonListView, HackathonDetailView, JoinHackathonView,
    SubmissionListView, SubmissionCreateView, VoteView
)

urlpatterns = [
    path('', HackathonListView.as_view(), name='hackathon-list'),
    path('<int:pk>/', HackathonDetailView.as_view(), name='hackathon-detail'),
    path('<int:pk>/join/', JoinHackathonView.as_view(), name='hackathon-join'),
    path('<int:pk>/submissions/', SubmissionListView.as_view(), name='hackathon-submissions'),
    path('<int:pk>/submit/', SubmissionCreateView.as_view(), name='hackathon-submit'),
    path('submissions/<int:submission_id>/vote/', VoteView.as_view(), name='submission-vote'),
]
