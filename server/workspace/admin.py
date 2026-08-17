from django.contrib import admin
from .models import WorkspaceFolder, WorkspaceFile

@admin.register(WorkspaceFolder)
class WorkspaceFolderAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'parent', 'created_at']
    search_fields = ['name']

@admin.register(WorkspaceFile)
class WorkspaceFileAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'folder', 'file_type', 'language', 'updated_at']
    search_fields = ['name']
