from django.db import models
from django.conf import settings


class NenoCoinRate(models.Model):
    rate = models.DecimalField(max_digits=10, decimal_places=4, help_text='1 NenoCoin = X KES')
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    class Meta:
        ordering = ['-updated_at']

    @classmethod
    def current_rate(cls):
        latest = cls.objects.first()
        return latest.rate if latest else 10

    def __str__(self):
        return f'1 NenoCoin = {self.rate} KES'


class Wallet(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wallet')
    real_balance = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    nenocoin_balance = models.DecimalField(max_digits=14, decimal_places=4, default=0)
    currency = models.CharField(max_length=10, default='KES')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.username} Wallet'


class Transaction(models.Model):
    TYPE_CHOICES = [
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
        ('transfer', 'Transfer'),
        ('escrow_hold', 'Escrow Hold'),
        ('escrow_release', 'Escrow Release'),
        ('purchase', 'Purchase'),
        ('earning', 'Earning'),
    ]
    CURRENCY_CHOICES = [('real', 'Real Currency'), ('nenocoin', 'NenoCoin')]
    STATUS_CHOICES = [('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')]

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    currency_type = models.CharField(max_length=10, choices=CURRENCY_CHOICES, default='real')
    amount = models.DecimalField(max_digits=14, decimal_places=4)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    reference = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'{self.transaction_type} - {self.amount} ({self.status})'


class Escrow(models.Model):
    STATUS_CHOICES = [('holding', 'Holding'), ('released', 'Released'), ('refunded', 'Refunded')]

    payer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='escrow_paid')
    payee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='escrow_received')
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    currency_type = models.CharField(max_length=10, default='real')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='holding')
    reference = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    released_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'Escrow {self.reference} - {self.status}'
