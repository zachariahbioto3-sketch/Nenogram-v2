from django.contrib import admin
from .models import NanoFolder, NanoFile


@admin.register(NanoFolder)
class NanoFolderAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'parent', 'created_at']
    list_filter = ['owner']
    search_fields = ['name']


@admin.register(NanoFile)
class NanoFileAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'file_type', 'visibility', 'is_published', 'updated_at']
    list_filter = ['file_type', 'visibility', 'is_published']
    search_fields = ['name', 'owner__username']
