from django.contrib import admin
from .models import Hackathon, HackathonParticipant, Submission, SubmissionVote


@admin.register(Hackathon)
class HackathonAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'prize', 'prize_currency', 'start_at', 'end_at', 'created_by']
    list_filter = ['prize_currency']
    search_fields = ['title']


@admin.register(HackathonParticipant)
class HackathonParticipantAdmin(admin.ModelAdmin):
    list_display = ['user', 'hackathon', 'joined_at']


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ['participant', 'hackathon', 'submitted_at']


@admin.register(SubmissionVote)
class SubmissionVoteAdmin(admin.ModelAdmin):
    list_display = ['voter', 'submission', 'created_at']
