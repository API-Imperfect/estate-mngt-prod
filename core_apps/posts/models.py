from django.db import models
from autoslug import AutoSlugField
from django.contrib.auth import get_user_model
from django.db.models import Count
from django.utils.translation import gettext_lazy as _
from taggit.managers import TaggableManager
from django.contrib.contenttypes.fields import GenericRelation

from core_apps.common.models import ContentView, TimeStampedModel
from core_apps.profiles.models import Profile

User = get_user_model()


class Post(TimeStampedModel):
    title = models.CharField(verbose_name=_("Title"), max_length=250)
    slug = AutoSlugField(populate_from="title", unique=True)
    body = models.TextField(verbose_name=_("Post"))
    tags = TaggableManager()
    author = models.ForeignKey(
        User, verbose_name=_("Author"), on_delete=models.CASCADE, related_name="posts"
    )
    bookmarked_by = models.ManyToManyField(
        User, related_name="bookmarked_posts", blank=True
    )
    upvotes = models.PositiveIntegerField(default=0, verbose_name=_("Upvotes"))
    upvoted_by = models.ManyToManyField(User, related_name="upvoted_posts", blank=True)
    downvotes = models.PositiveIntegerField(default=0, verbose_name=_("Downvotes"))
    downvoted_by = models.ManyToManyField(
        User, related_name="downvoted_posts", blank=True
    )

    content_views = GenericRelation(ContentView, related_query_name="posts")

    def __str__(self) -> str:
        return f"{self.title}"

    @classmethod
    def get_popular_tags(cls, limit=5):
        return cls.tags.annotate(post_count=Count("taggit_taggeditem_items")).order_by(
            "-post_count"
        )[:limit]

    def save(self, *args, **kwargs) -> None:
        if not (
            self.author.is_superuser
            or self.author.is_staff
            or self.author.profile.occupation == Profile.Occupation.TENANT
        ):
            raise ValueError(
                "Only tenants,superusers or staff members can create posts."
            )
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _("Post")
        verbose_name_plural = _("Posts")


class Reply(TimeStampedModel):
    post = models.ForeignKey(
        Post, verbose_name=_("Post"), on_delete=models.CASCADE, related_name="replies"
    )
    author = models.ForeignKey(
        User, verbose_name=_("Author"), on_delete=models.CASCADE, related_name="replies"
    )
    body = models.TextField(verbose_name=_("Reply"))

    def __str__(self) -> str:
        return f"Reply by {self.author.username} on {self.post.title}"

    class Meta:
        verbose_name = _("Reply")
        verbose_name_plural = _("Replies")
