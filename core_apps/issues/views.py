import logging
from typing import Any

from django.http import Http404
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.request import Request
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType

from core_apps.apartments.models import Apartment
from core_apps.common.models import ContentView
from core_apps.common.renderers import GenericJSONRenderer
from .emails import send_issue_confirmation_email, send_issue_resolved_email
from .models import Issue
from .serializers import IssueSerializer, IssueStatusUpdateSerializer

logger = logging.getLogger(__name__)


class IsStaffOrSuperUser(permissions.BasePermission):
    def __init__(self) -> None:
        self.message = None

    def has_permission(self, request, view):
        is_authorized = (
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or request.user.is_superuser)
        )
        if not is_authorized:
            self.message = (
                "Access to this information is restricted to staff and admin users only"
            )
        return is_authorized


class IssueListAPIView(generics.ListAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    renderer_classes = [GenericJSONRenderer]
    permission_classes = [IsStaffOrSuperUser]
    object_label = "issues"


class AssignedIssuesListView(generics.ListAPIView):
    serializer_class = IssueSerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "assigned_issues"

    def get_queryset(self):
        user = self.request.user
        return Issue.objects.filter(assigned_to=user)


class MyIssuesListAPIView(generics.ListAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "my_issues"

    def get_queryset(self):
        user = self.request.user
        return Issue.objects.filter(reported_by=user)


class IssueCreateAPIView(generics.CreateAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "issue"

    def perform_create(self, serializer: IssueSerializer) -> None:
        apartment_id = self.kwargs.get("apartment_id")

        if not apartment_id:
            raise ValidationError({"apartment_id": ["Apartment ID is required."]})
        try:
            apartment = Apartment.objects.get(id=apartment_id, tenant=self.request.user)
        except Apartment.DoesNotExist:
            raise PermissionDenied(
                "You do not have permission to report an issue for this apartment. its not yours"
            )

        issue = serializer.save(reported_by=self.request.user, apartment=apartment)

        send_issue_confirmation_email(issue)


class IssueDetailAPIView(generics.RetrieveAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    lookup_field = "id"
    renderer_classes = [GenericJSONRenderer]
    object_label = "issue"

    def get_object(self) -> Issue:
        issue = super().get_object()

        user = self.request.user
        if not (
            user == issue.reported_by or user.is_staff or user == issue.assigned_to
        ):
            raise PermissionDenied("You do not have permission to view this issue")
        self.record_issue_view(issue)
        return issue

    def record_issue_view(self, issue):
        content_type = ContentType.objects.get_for_model(issue)
        viewer_ip = self.get_client_ip()
        user = self.request.user

        obj, created = ContentView.objects.update_or_create(
            content_type=content_type,
            object_id=issue.pk,
            user=user,
            viewer_ip=viewer_ip,
            defaults={"last_viewed": timezone.now()},
        )

    def get_client_ip(self) -> str:
        x_forwared_for = self.request.META.get("HTTP_X_FORWARED_FOR")
        if x_forwared_for:
            ip = x_forwared_for.split(",")[0]
        else:
            ip = self.request.META.get("REMOTE_ADDR")
        return ip


class IssueUpdateAPIView(generics.UpdateAPIView):
    queryset = Issue.objects.all()
    lookup_field = "id"
    serializer_class = IssueStatusUpdateSerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "issue"

    def get_object(self) -> Issue:
        issue = super().get_object()
        user = self.request.user

        if not (user.is_staff or user == issue.assigned_to):
            logger.warning(
                f"Unauthorized issue status update attempt by user {user.get_full_name} on issue {issue.title}"
            )
            raise PermissionDenied("You do not have permission to update the issue")
        send_issue_resolved_email(issue)
        return issue


class IssueDeleteAPIView(generics.DestroyAPIView):
    queryset = Issue.objects.all()
    lookup_field = "id"
    serializer_class = IssueSerializer

    def get_object(self) -> Issue:
        try:
            issue = super().get_object()
        except Http404:
            raise Http404("Issue not found") from None
        user = self.request.user
        if not (user == issue.reported_by or user.is_staff):
            logger.warning(
                f"Unauthorized delete attempt by user {user.get_full_name} on issue {issue.title}"
            )
            raise PermissionDenied("You do not have permission to delete this issue")
        return issue

    def delete(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        super().delete(request, *args, **kwargs)
        return Response(status=status.HTTP_204_NO_CONTENT)
