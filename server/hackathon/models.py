from django.db import models
from django.conf import settings
from django.utils import timezone


class Hackathon(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    banner = models.ImageField(upload_to='hackathon_banners/', blank=True, null=True)
    prize = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    prize_currency = models.CharField(max_length=10, default='KES')
    start_at = models.DateTimeField()
    end_at = models.DateTimeField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_hackathons')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def status(self):
        now = timezone.now()
        if now < self.start_at:
            return 'upcoming'
        elif now > self.end_at:
            return 'ended'
        return 'active'

    @property
    def participant_count(self):
        return self.participants.count()

    def __str__(self):
        return self.title


class HackathonParticipant(models.Model):
    hackathon = models.ForeignKey(Hackathon, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='hackathon_participations')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('hackathon', 'user')

    def __str__(self):
        return f'{self.user.username} in {self.hackathon.title}'


class Submission(models.Model):
    hackathon = models.ForeignKey(Hackathon, on_delete=models.CASCADE, related_name='submissions')
    participant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='hackathon_submissions')
    nano_file = models.ForeignKey('nano.NanoFile', on_delete=models.SET_NULL, null=True, blank=True, related_name='hackathon_submissions')
    repo_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('hackathon', 'participant')
        ordering = ['-submitted_at']

    @property
    def vote_count(self):
        return self.votes.count()

    def __str__(self):
        return f'{self.participant.username} - {self.hackathon.title}'


class SubmissionVote(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='votes')
    voter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='hackathon_votes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('submission', 'voter')

    def __str__(self):
        return f'{self.voter.username} voted {self.submission.id}'
