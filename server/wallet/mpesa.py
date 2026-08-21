import base64
import requests
from datetime import datetime
from django.conf import settings


def get_access_token():
    url = settings.MPESA_BASE_URL + '/oauth/v1/generate?grant_type=client_credentials'
    response = requests.get(
        url,
        auth=(settings.MPESA_CONSUMER_KEY, settings.MPESA_CONSUMER_SECRET),
        timeout=30,
    )
    response.raise_for_status()
    return response.json()['access_token']


def generate_password():
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    raw = settings.MPESA_SHORTCODE + settings.MPESA_PASSKEY + timestamp
    encoded = base64.b64encode(raw.encode()).decode()
    return encoded, timestamp


def stk_push(phone, amount, reference, description='Nenogram Deposit'):
    token = get_access_token()
    password, timestamp = generate_password()
    phone = str(phone).strip()
    if phone.startswith('0'):
        phone = '254' + phone[1:]
    elif phone.startswith('+'):
        phone = phone[1:]
    url = settings.MPESA_BASE_URL + '/mpesa/stkpush/v1/processrequest'
    payload = {
        'BusinessShortCode': settings.MPESA_SHORTCODE,
        'Password': password,
        'Timestamp': timestamp,
        'TransactionType': 'CustomerPayBillOnline',
        'Amount': int(amount),
        'PartyA': phone,
        'PartyB': settings.MPESA_SHORTCODE,
        'PhoneNumber': phone,
        'CallBackURL': settings.MPESA_CALLBACK_URL,
        'AccountReference': reference,
        'TransactionDesc': description,
    }
    headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    }
    response = requests.post(url, json=payload, headers=headers, timeout=30)
    response.raise_for_status()
    return response.json()


def b2c_transfer(phone, amount, reference, remarks='Nenogram Withdrawal'):
    token = get_access_token()
    phone = str(phone).strip()
    if phone.startswith('0'):
        phone = '254' + phone[1:]
    elif phone.startswith('+'):
        phone = phone[1:]
    url = settings.MPESA_BASE_URL + '/mpesa/b2c/v1/paymentrequest'
    payload = {
        'InitiatorName': settings.MPESA_INITIATOR_NAME,
        'SecurityCredential': settings.MPESA_SECURITY_CREDENTIAL,
        'CommandID': 'BusinessPayment',
        'Amount': int(amount),
        'PartyA': settings.MPESA_SHORTCODE,
        'PartyB': phone,
        'Remarks': remarks,
        'QueueTimeOutURL': settings.MPESA_B2C_TIMEOUT_URL,
        'ResultURL': settings.MPESA_B2C_RESULT_URL,
        'Occasion': reference,
    }
    headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    }
    response = requests.post(url, json=payload, headers=headers, timeout=30)
    response.raise_for_status()
    return response.json()
