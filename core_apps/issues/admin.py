from django.contrib import admin
from django.contrib.contenttypes.models import ContentType

from core_apps.common.admin import ContentViewInline
from core_apps.common.models import ContentView
from .models import Issue


@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "apartment",
        "reported_by",
        "assigned_to",
        "status",
        "priority",
        "get_total_views",
    ]

    list_display_links = ["id", "apartment"]
    list_filter = ["status", "priority"]
    search_fields = ["apartment__unit_number", "reported_by__first_name"]
    ordering = ["-created_at"]
    autocomplete_fields = ["apartment", "reported_by", "assigned_to"]
    inlines = [ContentViewInline]

    def get_total_views(self, obj):
        content_type = ContentType.objects.get_for_model(obj)
        views = ContentView.objects.filter(
            content_type=content_type, object_id=obj.pkid
        ).count()
        return views

    get_total_views.short_description = "Total Views"
