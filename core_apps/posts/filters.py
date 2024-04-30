import django_filters
from taggit.models import Tag
from django.db.models import Count

from .models import Post


class PostFilter(django_filters.FilterSet):
    tags = django_filters.ModelMultipleChoiceFilter(
        field_name="tags__name",
        to_field_name="name",
        queryset=Tag.objects.all(),
        lookup_expr="icontains",
    )
    author_username = django_filters.CharFilter(
        field_name="author__username", lookup_expr="icontains"
    )
    most_replied_to = django_filters.BooleanFilter(method="filter_most_replied_to")

    ordering = django_filters.OrderingFilter(
        fields=(
            ("created_at", "oldest"),
            ("-created_at", "most_recent"),
            ("-replies_count", "most_replied_to"),
        )
    )

    def filter_most_replied_to(self, queryset, name, value):
        if value:
            return queryset.annotate(replies_count=Count("replies")).filter(
                replies_count__gt=0
            )
        return queryset

    class Meta:
        model = Post
        fields = ["tags", "author_username", "ordering", "most_replied_to"]
