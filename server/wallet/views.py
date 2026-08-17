import uuid
import logging
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Wallet, Transaction, NenoCoinRate
from .serializers import WalletSerializer, TransactionSerializer
from . import mpesa as mpesa_service

logger = logging.getLogger(__name__)


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
    transaction = Transaction.objects.create(
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
        result = mpesa_service.stk_push(
            phone=phone,
            amount=amount,
            reference=reference,
        )
        checkout_id = result.get('CheckoutRequestID', '')
        transaction.description = 'M-Pesa STK — ' + checkout_id
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
        return Response({'detail': 'M-Pesa request failed. Check credentials or use sandbox.'}, status=status.HTTP_502_BAD_GATEWAY)


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
        amount = meta.get('Amount')
        mpesa_receipt = meta.get('MpesaReceiptNumber', '')
        tx = Transaction.objects.filter(description__contains=checkout_id).first()
        if tx and tx.status == 'pending':
            tx.status = 'completed'
            tx.reference = mpesa_receipt or tx.reference
            from django.utils import timezone
            tx.completed_at = timezone.now()
            tx.save(update_fields=['status', 'reference', 'completed_at'])
            wallet = tx.wallet
            wallet.real_balance += tx.amount
            wallet.save(update_fields=['real_balance'])
            logger.info('Wallet credited: ' + str(tx.amount) + ' for ' + str(wallet.id))
        return Response({'ResultCode': 0, 'ResultDesc': 'Accepted'})
    except Exception as e:
        logger.error('M-Pesa callback error: ' + str(e))
        return Response({'ResultCode': 0, 'ResultDesc': 'Accepted'})
