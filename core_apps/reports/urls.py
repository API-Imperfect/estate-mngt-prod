from django.urls import path
from .views import ReportCreateAPIView, ReportListAPIView

urlpatterns = [
    path("create/", ReportCreateAPIView.as_view(), name="create-report"),
    path("me/", ReportListAPIView.as_view(), name="my-reports"),
]
