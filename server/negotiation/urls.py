from django.urls import path
from . import views

urlpatterns = [
    path("rooms/", views.my_rooms, name="my-rooms"),
    path("rooms/<uuid:room_id>/", views.get_room, name="room-detail"),
]
