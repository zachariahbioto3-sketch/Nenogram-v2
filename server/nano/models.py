import uuid
from django.db import models
from django.conf import settings
from django.utils.text import slugify

LANGUAGE_CHOICES = [
    ('plain', 'Plain Text'),
    ('python', 'Python'),
    ('javascript', 'JavaScript'),
    ('typescript', 'TypeScript'),
    ('html', 'HTML'),
    ('css', 'CSS'),
    ('json', 'JSON'),
    ('markdown', 'Markdown'),
    ('bash', 'Bash'),
    ('sql', 'SQL'),
]

VISIBILITY_CHOICES = [
    ('public', 'Public'),
    ('private', 'Private'),
]


class Nano(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='nanos')
    title = models.CharField(max_length=200, default='Untitled')
    content = models.TextField(blank=True)
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES, default='plain')
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default='private')
    slug = models.SlugField(unique=True, max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title) or 'nano'
            self.slug = base + '-' + str(uuid.uuid4())[:8]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
