from django.urls import path
from . import views

urlpatterns = [
    path("categories/", views.CategoryListView.as_view(), name="categories"),

    path("gigs/", views.GigListCreateView.as_view(), name="gig-list"),
    path("gigs/<uuid:pk>/", views.GigDetailView.as_view(), name="gig-detail"),
    path("gigs/<uuid:gig_id>/order/", views.order_gig, name="gig-order"),

    path("jobs/", views.JobListCreateView.as_view(), name="job-list"),
    path("jobs/<uuid:pk>/", views.JobDetailView.as_view(), name="job-detail"),
    path("jobs/<uuid:job_id>/bids/", views.JobBidListView.as_view(), name="job-bids"),
    path("jobs/<uuid:job_id>/bid/", views.place_bid, name="place-bid"),

    path("bids/<uuid:bid_id>/accept/", views.accept_bid, name="accept-bid"),
    path("bids/<uuid:bid_id>/reject/", views.reject_bid, name="reject-bid"),

    path("contracts/", views.MyContractsView.as_view(), name="my-contracts"),
    path("contracts/<uuid:pk>/", views.ContractDetailView.as_view(), name="contract-detail"),

    path("milestones/<uuid:milestone_id>/submit/", views.submit_milestone, name="milestone-submit"),
    path("milestones/<uuid:milestone_id>/approve/", views.approve_milestone, name="milestone-approve"),

    path("disputes/", views.DisputeCreateView.as_view(), name="dispute-create"),
]