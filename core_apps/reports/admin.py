from django.contrib import admin
from django.db.models import QuerySet
from django.http import HttpRequest

from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "reported_by",
        "reported_user",
        "get_report_count",
        "created_at",
    ]
    search_fields = [
        "title",
        "reported_by__first_name",
        "reported_user__first_name",
        "reported_user__last_name",
    ]

    def get_queryset(self, request: HttpRequest) -> QuerySet[Report]:
        queryset = super().get_queryset(request)
        queryset = queryset.select_related("reported_user__profile")
        return queryset

    def get_report_count(self, obj: Report) -> int:
        return obj.reported_user.profile.report_count

    get_report_count.short_description = "Report Count"
