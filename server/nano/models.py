import uuid
import os
from django.db import models
from django.conf import settings


LANGUAGE_CHOICES = [
    ('plaintext', 'Plain Text'),
    ('python', 'Python'),
    ('javascript', 'JavaScript'),
    ('typescript', 'TypeScript'),
    ('jsx', 'JSX'),
    ('tsx', 'TSX'),
    ('html', 'HTML'),
    ('css', 'CSS'),
    ('json', 'JSON'),
    ('bash', 'Bash'),
    ('sql', 'SQL'),
    ('markdown', 'Markdown'),
]

VISIBILITY_CHOICES = [
    ('public', 'Public'),
    ('private', 'Private'),
]

FILE_TYPE_CHOICES = [
    ('richtext', 'Rich Text'),
    ('code', 'Code'),
]


def thumbnail_upload_path(instance, filename):
    ext = os.path.splitext(filename)[1]
    return f'nano/thumbnails/{uuid.uuid4()}{ext}'


def inline_image_upload_path(instance, filename):
    ext = os.path.splitext(filename)[1]
    return f'nano/images/{uuid.uuid4()}{ext}'


class NanoFolder(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='nano_folders')
    name = models.CharField(max_length=200)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subfolders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        unique_together = ('owner', 'parent', 'name')

    @property
    def file_count(self):
        return self.files.count()

    def __str__(self):
        return self.name


class NanoFile(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='nano_files')
    folder = models.ForeignKey(NanoFolder, on_delete=models.CASCADE, null=True, blank=True, related_name='files')
    name = models.CharField(max_length=200)
    file_type = models.CharField(max_length=10, choices=FILE_TYPE_CHOICES, default='richtext')
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES, default='plaintext')
    content = models.TextField(blank=True)
    thumbnail = models.ImageField(upload_to=thumbnail_upload_path, null=True, blank=True)
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default='private')
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.name


class NanoInlineImage(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='nano_images')
    image = models.ImageField(upload_to=inline_image_upload_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Image {self.pk} by {self.owner}'
