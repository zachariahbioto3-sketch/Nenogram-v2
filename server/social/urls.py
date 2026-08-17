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
]
