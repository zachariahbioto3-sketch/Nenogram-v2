from django.urls import path
from . import views

urlpatterns = [
    # Categories
    path("categories/", views.CategoryListView.as_view(), name="categories"),

    # Gigs
    path("gigs/", views.GigListCreateView.as_view(), name="gig-list"),
    path("gigs/<uuid:pk>/", views.GigDetailView.as_view(), name="gig-detail"),
    path("gigs/<uuid:gig_id>/order/", views.order_gig, name="gig-order"),

    # Jobs
    path("jobs/", views.JobListCreateView.as_view(), name="job-list"),
    path("jobs/<uuid:pk>/", views.JobDetailView.as_view(), name="job-detail"),
    path("jobs/<uuid:job_id>/bids/", views.JobBidListView.as_view(), name="job-bids"),
    path("jobs/<uuid:job_id>/bid/", views.place_bid, name="place-bid"),

    # Bids
    path("bids/<uuid:bid_id>/accept/", views.accept_bid, name="accept-bid"),

    # Contracts
    path("contracts/", views.MyContractsView.as_view(), name="my-contracts"),
    path("contracts/<uuid:pk>/", views.ContractDetailView.as_view(), name="contract-detail"),

    # Milestones
    path("milestones/<uuid:milestone_id>/submit/", views.submit_milestone, name="milestone-submit"),
    path("milestones/<uuid:milestone_id>/approve/", views.approve_milestone, name="milestone-approve"),

    # Disputes
    path("disputes/", views.DisputeCreateView.as_view(), name="dispute-create"),
]
