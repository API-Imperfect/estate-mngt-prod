from django.urls import path

from .views import ApartmentCreateAPIView, ApartmentDetailAPIView

urlpatterns = [
    path("add/", ApartmentCreateAPIView.as_view(), name="add-apartment"),
    path("my-apartment/", ApartmentDetailAPIView.as_view(), name="apartment-detail"),
]
