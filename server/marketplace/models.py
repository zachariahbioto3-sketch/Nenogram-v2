import uuid
from django.db import models
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


# ─── GIG SYSTEM (developer-initiated) ───────────────────────────────────────

class Gig(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    developer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="gigs")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="gigs")
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    currency_type = models.CharField(max_length=10, choices=[("real", "Real Currency"), ("nenocoin", "NenoCoin")], default="real")
    delivery_days = models.PositiveIntegerField(default=7)
    tags = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class GigOrder(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("active", "Active"),
        ("delivered", "Delivered"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
        ("disputed", "Disputed"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    gig = models.ForeignKey(Gig, on_delete=models.CASCADE, related_name="orders")
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="gig_orders")
    requirements = models.TextField(blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency_type = models.CharField(max_length=10, default="real")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return "Order " + str(self.id)[:8] + " - " + self.gig.title


# ─── JOB SYSTEM (client-initiated) ──────────────────────────────────────────

class Job(models.Model):
    STATUS_CHOICES = [
        ("open", "Open"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]
    CATEGORY_CHOICES = [
        ("web", "Web Development"),
        ("mobile", "Mobile App"),
        ("api", "API / Backend"),
        ("data", "Data & Analytics"),
        ("design", "UI/UX Design"),
        ("ecommerce", "E-commerce"),
        ("automation", "Automation"),
        ("other", "Other"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posted_jobs")
    title = models.CharField(max_length=300)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    skills_required = models.JSONField(default=list)
    budget_min = models.DecimalField(max_digits=12, decimal_places=2)
    budget_max = models.DecimalField(max_digits=12, decimal_places=2)
    currency_type = models.CharField(max_length=10, choices=[("real", "Real Currency"), ("nenocoin", "NenoCoin")], default="real")
    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Bid(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
        ("withdrawn", "Withdrawn"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="bids")
    developer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bids")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency_type = models.CharField(max_length=10, default="real")
    timeline_days = models.PositiveIntegerField()
    cover_letter = models.TextField()
    proposed_milestones = models.JSONField(default=list, help_text="List of {title, amount, days} objects")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("job", "developer")
        ordering = ["-created_at"]

    def __str__(self):
        return str(self.developer) + " -> " + str(self.job)


# ─── CONTRACT + MILESTONE SYSTEM ─────────────────────────────────────────────

class Contract(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
        ("disputed", "Disputed"),
    ]
    SOURCE_CHOICES = [
        ("job", "Job Bid"),
        ("gig", "Gig Order"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="contracts_as_client")
    developer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="contracts_as_developer")
    source = models.CharField(max_length=10, choices=SOURCE_CHOICES)
    job = models.OneToOneField(Job, on_delete=models.SET_NULL, null=True, blank=True, related_name="contract")
    gig_order = models.OneToOneField(GigOrder, on_delete=models.SET_NULL, null=True, blank=True, related_name="contract")
    title = models.CharField(max_length=300)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency_type = models.CharField(max_length=10, default="real")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return "Contract " + str(self.id)[:8] + " - " + self.title


class Milestone(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("submitted", "Submitted"),
        ("approved", "Approved"),
        ("disputed", "Disputed"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="milestones")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency_type = models.CharField(max_length=10, default="real")
    order = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    due_date = models.DateField(null=True, blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    escrow = models.OneToOneField("wallet.Escrow", on_delete=models.SET_NULL, null=True, blank=True, related_name="milestone")

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title + " (" + self.status + ")"


class MilestoneSubmission(models.Model):
    milestone = models.ForeignKey(Milestone, on_delete=models.CASCADE, related_name="submissions")
    note = models.TextField()
    attachments = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "Submission for " + self.milestone.title


class Dispute(models.Model):
    STATUS_CHOICES = [
        ("open", "Open"),
        ("resolved", "Resolved"),
        ("escalated", "Escalated"),
    ]
    RESOLUTION_CHOICES = [
        ("client", "Favour Client"),
        ("developer", "Favour Developer"),
        ("split", "Split"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="disputes")
    milestone = models.ForeignKey(Milestone, on_delete=models.SET_NULL, null=True, blank=True, related_name="disputes")
    raised_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="disputes_raised")
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")
    resolution = models.CharField(max_length=20, choices=RESOLUTION_CHOICES, null=True, blank=True)
    resolved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="disputes_resolved")
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return "Dispute " + str(self.id)[:8] + " - " + self.status
