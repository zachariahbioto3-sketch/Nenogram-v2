from django.urls import path
from . import views

urlpatterns = [
    path('', views.wallet_detail, name='wallet_detail'),
    path('transactions/', views.transaction_list, name='transaction_list'),
    path('deposit/', views.deposit, name='deposit'),
    path('mpesa/stk/', views.mpesa_stk, name='mpesa_stk'),
    path('mpesa/callback/', views.mpesa_callback, name='mpesa_callback'),
]
