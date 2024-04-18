from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline
from .models import ContentView


@admin.register(ContentView)
class ContentViewAdmin(admin.ModelAdmin):
    list_display = ["content_object", "user", "viewer_ip", "created_at"]


class ContentViewInline(GenericTabularInline):
    model = ContentView
    extra = 0
    readonly_fields = ["user", "viewer_ip", "created_at"]
