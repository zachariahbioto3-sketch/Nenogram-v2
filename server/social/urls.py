from django.urls import path
from . import views

urlpatterns = [
    path('feed/', views.feed, name='feed'),
    path('explore/', views.explore, name='explore'),
    path('posts/', views.create_post, name='create_post'),
    path('posts/<int:pk>/', views.delete_post, name='delete_post'),
    path('posts/<int:pk>/like/', views.toggle_like, name='toggle_like'),
    path('follow/<str:username>/', views.toggle_follow, name='toggle_follow'),
    path('profile/<str:username>/posts/', views.user_posts, name='user_posts'),
    path('posts/<int:pk>/comments/', views.post_comments, name='post-comments'),
    path('comments/<int:pk>/', views.delete_comment, name='delete-comment'),
    path('posts/<int:pk>/comments/', views.post_comments, name='post-comments'),
    path('comments/<int:pk>/', views.delete_comment, name='delete-comment'),
    path('notifications/', views.notifications, name='notifications'),
    path('notifications/mark-read/', views.mark_notifications_read, name='mark-read'),
    path('notifications/unread-count/', views.unread_count, name='unread-count'),
]