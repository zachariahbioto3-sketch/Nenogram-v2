from django.urls import path
from . import views

urlpatterns = [
    path('', views.nano_list_create, name='nano_list_create'),
    path('public/', views.nano_public, name='nano_public'),
    path('<slug:slug>/', views.nano_detail, name='nano_detail'),
]
