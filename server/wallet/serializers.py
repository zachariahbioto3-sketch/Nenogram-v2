from rest_framework import serializers
from .models import Wallet, Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'transaction_type', 'currency_type', 'amount', 'status', 'reference', 'description', 'created_at', 'completed_at']

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['id', 'real_balance', 'nenocoin_balance', 'currency', 'updated_at']
