import uuid
import logging
from django.db import transaction as db_transaction
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Wallet, Transaction, NenoCoinRate
from .serializers import WalletSerializer, TransactionSerializer
from . import mpesa as mpesa_service

logger = logging.getLogger(__name__)
User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wallet_detail(request):
    try:
        wallet = request.user.wallet
    except Wallet.DoesNotExist:
        return Response({'detail': 'Wallet not found'}, status=status.HTTP_404_NOT_FOUND)
    rate = NenoCoinRate.current_rate()
    data = WalletSerializer(wallet).data
    data['nenocoin_rate'] = str(rate)
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def transaction_list(request):
    try:
        wallet = request.user.wallet
    except Wallet.DoesNotExist:
        return Response({'detail': 'Wallet not found'}, status=status.HTTP_404_NOT_FOUND)
    transactions = wallet.transactions.order_by('-created_at')[:50]
    return Response(TransactionSerializer(transactions, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deposit(request):
    try:
        wallet = request.user.wallet
    except Wallet.DoesNotExist:
        return Response({'detail': 'Wallet not found'}, status=status.HTTP_404_NOT_FOUND)
    amount = request.data.get('amount')
    method = request.data.get('method', 'mpesa')
    if not amount:
        return Response({'detail': 'Amount is required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        amount = float(amount)
        if amount <= 0:
            raise ValueError
    except (ValueError, TypeError):
        return Response({'detail': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)
    if method not in ['mpesa', 'stripe']:
        return Response({'detail': 'Invalid method'}, status=status.HTTP_400_BAD_REQUEST)
    reference = str(uuid.uuid4()).replace('-', '')[:20].upper()
    Transaction.objects.create(
        wallet=wallet,
        transaction_type='deposit',
        currency_type='real',
        amount=amount,
        status='pending',
        reference=reference,
        description='Deposit via ' + method,
    )
    return Response({
        'detail': 'Deposit initiated',
        'reference': reference,
        'amount': amount,
        'method': method,
        'status': 'pending',
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mpesa_stk(request):
    try:
        wallet = request.user.wallet
    except Wallet.DoesNotExist:
        return Response({'detail': 'Wallet not found'}, status=status.HTTP_404_NOT_FOUND)
    amount = request.data.get('amount')
    phone = request.data.get('phone')
    if not amount or not phone:
        return Response({'detail': 'Amount and phone are required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        amount = float(amount)
        if amount < 1:
            raise ValueError
    except (ValueError, TypeError):
        return Response({'detail': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)
    reference = str(uuid.uuid4()).replace('-', '')[:10].upper()
    transaction = Transaction.objects.create(
        wallet=wallet,
        transaction_type='deposit',
        currency_type='real',
        amount=amount,
        status='pending',
        reference=reference,
        description='M-Pesa STK deposit',
    )
    try:
        result = mpesa_service.stk_push(phone=phone, amount=amount, reference=reference)
        checkout_id = result.get('CheckoutRequestID', '')
        transaction.description = 'M-Pesa STK - ' + checkout_id
        transaction.save(update_fields=['description'])
        return Response({
            'detail': 'STK push sent. Check your phone.',
            'reference': reference,
            'checkout_id': checkout_id,
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        transaction.status = 'failed'
        transaction.save(update_fields=['status'])
        logger.error('M-Pesa STK error: ' + str(e))
        return Response({'detail': 'M-Pesa request failed.'}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def withdraw(request):
    try:
        wallet = request.user.wallet
    except Wallet.DoesNotExist:
        return Response({'detail': 'Wallet not found'}, status=status.HTTP_404_NOT_FOUND)
    amount = request.data.get('amount')
    phone = request.data.get('phone')
    if not amount or not phone:
        return Response({'detail': 'Amount and phone are required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        amount = float(amount)
        if amount < 10:
            raise ValueError
    except (ValueError, TypeError):
        return Response({'detail': 'Minimum withdrawal is KES 10'}, status=status.HTTP_400_BAD_REQUEST)
    if wallet.real_balance < amount:
        return Response({'detail': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
    reference = str(uuid.uuid4()).replace('-', '')[:10].upper()
    with db_transaction.atomic():
        wallet.real_balance -= amount
        wallet.save(update_fields=['real_balance'])
        tx = Transaction.objects.create(
            wallet=wallet,
            transaction_type='withdrawal',
            currency_type='real',
            amount=amount,
            status='pending',
            reference=reference,
            description='M-Pesa B2C withdrawal',
        )
    try:
        result = mpesa_service.b2c_transfer(phone=phone, amount=amount, reference=reference)
        tx.description = 'M-Pesa B2C - ' + result.get('ConversationID', '')
        tx.save(update_fields=['description'])
        return Response({
            'detail': 'Withdrawal initiated. Funds will arrive shortly.',
            'reference': reference,
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        with db_transaction.atomic():
            wallet.real_balance += amount
            wallet.save(update_fields=['real_balance'])
            tx.status = 'failed'
            tx.save(update_fields=['status'])
        logger.error('B2C error: ' + str(e))
        return Response({'detail': 'Withdrawal failed. Balance restored.'}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def transfer(request):
    try:
        sender_wallet = request.user.wallet
    except Wallet.DoesNotExist:
        return Response({'detail': 'Wallet not found'}, status=status.HTTP_404_NOT_FOUND)
    amount = request.data.get('amount')
    recipient_username = request.data.get('username')
    currency_type = request.data.get('currency_type', 'real')
    if not amount or not recipient_username:
        return Response({'detail': 'Amount and username are required'}, status=status.HTTP_400_BAD_REQUEST)
    if currency_type not in ['real', 'nenocoin']:
        return Response({'detail': 'Invalid currency type'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        amount = float(amount)
        if amount <= 0:
            raise ValueError
    except (ValueError, TypeError):
        return Response({'detail': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)
    if recipient_username == request.user.username:
        return Response({'detail': 'Cannot transfer to yourself'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        recipient = User.objects.get(username=recipient_username)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    try:
        recipient_wallet = recipient.wallet
    except Wallet.DoesNotExist:
        return Response({'detail': 'Recipient has no wallet'}, status=status.HTTP_404_NOT_FOUND)
    balance_field = 'real_balance' if currency_type == 'real' else 'nenocoin_balance'
    if getattr(sender_wallet, balance_field) < amount:
        return Response({'detail': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
    reference = str(uuid.uuid4()).replace('-', '')[:12].upper()
    with db_transaction.atomic():
        setattr(sender_wallet, balance_field, getattr(sender_wallet, balance_field) - amount)
        sender_wallet.save(update_fields=[balance_field])
        setattr(recipient_wallet, balance_field, getattr(recipient_wallet, balance_field) + amount)
        recipient_wallet.save(update_fields=[balance_field])
        Transaction.objects.create(
            wallet=sender_wallet,
            transaction_type='transfer',
            currency_type=currency_type,
            amount=amount,
            status='completed',
            reference=reference,
            description='Transfer to @' + recipient_username,
            completed_at=timezone.now(),
        )
        Transaction.objects.create(
            wallet=recipient_wallet,
            transaction_type='earning',
            currency_type=currency_type,
            amount=amount,
            status='completed',
            reference=reference + '_IN',
            description='Transfer from @' + request.user.username,
            completed_at=timezone.now(),
        )
    return Response({
        'detail': 'Transfer successful',
        'reference': reference,
        'amount': amount,
        'currency_type': currency_type,
        'recipient': recipient_username,
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def mpesa_callback(request):
    try:
        body = request.data.get('Body', {})
        stk = body.get('stkCallback', {})
        result_code = stk.get('ResultCode')
        checkout_id = stk.get('CheckoutRequestID', '')
        if result_code != 0:
            logger.warning('M-Pesa callback failed — ResultCode: ' + str(result_code))
            tx = Transaction.objects.filter(description__contains=checkout_id).first()
            if tx:
                tx.status = 'failed'
                tx.save(update_fields=['status'])
            return Response({'ResultCode': 0, 'ResultDesc': 'Accepted'})
        metadata = stk.get('CallbackMetadata', {}).get('Item', [])
        meta = {item['Name']: item.get('Value') for item in metadata}
        mpesa_receipt = meta.get('MpesaReceiptNumber', '')
        tx = Transaction.objects.filter(description__contains=checkout_id).first()
        if tx and tx.status == 'pending':
            tx.status = 'completed'
            tx.reference = mpesa_receipt or tx.reference
            tx.completed_at = timezone.now()
            tx.save(update_fields=['status', 'reference', 'completed_at'])
            wallet = tx.wallet
            wallet.real_balance += tx.amount
            wallet.save(update_fields=['real_balance'])
            logger.info('Wallet credited: ' + str(tx.amount))
        return Response({'ResultCode': 0, 'ResultDesc': 'Accepted'})
    except Exception as e:
        logger.error('M-Pesa callback error: ' + str(e))
        return Response({'ResultCode': 0, 'ResultDesc': 'Accepted'})


