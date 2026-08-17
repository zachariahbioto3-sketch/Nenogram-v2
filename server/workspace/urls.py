from django.urls import path
from .views import FolderListCreateView, FolderDetailView, FileListCreateView, FileDetailView

urlpatterns = [
    path('folders/', FolderListCreateView.as_view(), name='workspace-folders'),
    path('folders/<int:pk>/', FolderDetailView.as_view(), name='workspace-folder-detail'),
    path('files/', FileListCreateView.as_view(), name='workspace-files'),
    path('files/<int:pk>/', FileDetailView.as_view(), name='workspace-file-detail'),
]
