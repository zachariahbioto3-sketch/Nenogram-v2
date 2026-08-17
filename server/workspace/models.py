from django.db import models
from django.conf import settings


class WorkspaceFolder(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='workspace_folders')
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


class WorkspaceFile(models.Model):
    FILE_TYPE_CHOICES = [('richtext', 'Rich Text'), ('code', 'Code')]
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
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='workspace_files')
    folder = models.ForeignKey(WorkspaceFolder, on_delete=models.CASCADE, null=True, blank=True, related_name='files')
    name = models.CharField(max_length=200)
    file_type = models.CharField(max_length=10, choices=FILE_TYPE_CHOICES, default='richtext')
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES, default='plaintext')
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.name
