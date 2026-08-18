from django.urls import path
from . import views

urlpatterns = [
    path('gigs/', views.gig_list, name='gig_list'),
    path('gigs/<int:pk>/', views.gig_detail, name='gig_detail'),
    path('gigs/create/', views.gig_create, name='gig_create'),
    path('categories/', views.category_list, name='category_list'),

    path('jobs/', views.JobListCreateView.as_view(), name='job-list-create'),
    path('jobs/<uuid:pk>/', views.JobDetailView.as_view(), name='job-detail'),
    path('jobs/<uuid:pk>/bids/', views.JobBidListCreateView.as_view(), name='job-bid-list-create'),
    path('bids/<uuid:pk>/accept/', views.AcceptBidView.as_view(), name='bid-accept'),
    path('bids/<uuid:pk>/reject/', views.RejectBidView.as_view(), name='bid-reject'),
]