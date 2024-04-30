from django.contrib.auth import get_user_model
from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.views import View

from core_apps.profiles.models import Profile

User = get_user_model()


class CanCreateEditPost(permissions.BasePermission):
    message = "You do not have permission to create of edit this post."

    def has_permission(self, request: Request, view: View) -> bool:
        user = request.user
        if not user or not user.is_authenticated:
            self.message = "Authentication is required to access this resource"
            return False

        if user.is_superuser or user.is_staff:
            return True

        profile = getattr(user, "profile", None)
        if profile and profile.occupation == Profile.Occupation.TENANT:
            return True

        return False
