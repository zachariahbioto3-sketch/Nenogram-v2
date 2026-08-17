from django.urls import path
from . import views

urlpatterns = [
    path('gigs/', views.gig_list, name='gig_list'),
    path('gigs/<int:pk>/', views.gig_detail, name='gig_detail'),
    path('gigs/create/', views.gig_create, name='gig_create'),
    path('categories/', views.category_list, name='category_list'),
]
