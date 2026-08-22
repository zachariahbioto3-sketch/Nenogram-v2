from django.urls import path
from .views import FolderListCreateView, FolderDetailView, FileListCreateView, FileDetailView
from . import views

urlpatterns = [
    path('folders/', FolderListCreateView.as_view(), name='nano-folders'),
    path('folders/<int:pk>/', FolderDetailView.as_view(), name='nano-folder-detail'),
    path('files/', FileListCreateView.as_view(), name='nano-files'),
    path('files/<int:pk>/', FileDetailView.as_view(), name='nano-file-detail'),
    path('files/<int:pk>/publish/', views.publish_file, name='nano-file-publish'),
    path('files/<int:pk>/unpublish/', views.unpublish_file, name='nano-file-unpublish'),
    path('files/<int:pk>/thumbnail/', views.upload_thumbnail, name='nano-file-thumbnail'),
    path('images/', views.upload_inline_image, name='nano-inline-image'),
    path('feed/', views.nano_feed, name='nano-feed'),
]
