from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.db.models import F
from rest_framework import serializers
from taggit.models import Tag
from taggit.serializers import TagListSerializerField, TaggitSerializer
from core_apps.common.models import ContentView
from core_apps.posts.models import Post, Reply

User = get_user_model()


class PopularTagSerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Tag
        fields = ["name", "slug", "post_count"]


class TopPostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source="author.username")
    replies_count = serializers.IntegerField(read_only=True)
    view_count = serializers.IntegerField(read_only=True)
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "author_username",
            "upvotes",
            "view_count",
            "replies_count",
            "avatar",
            "created_at",
        ]

    def get_avatar(self, obj) -> str | None:
        if obj.author.profile.avatar:
            return obj.author.profile.avatar.url
        return None


class ReplySerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source="author.username")
    post = serializers.PrimaryKeyRelatedField(read_only=True)
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = Reply
        fields = [
            "id",
            "post",
            "author_username",
            "body",
            "avatar",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "author_username",
            "created_at",
            "updated_at",
        ]

    def get_avatar(self, obj) -> str | None:
        if obj.author.profile.avatar:
            return obj.author.profile.avatar.url
        return None


class UpvotePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = []

    def update(self, instance, validated_data):
        user = self.context["request"].user
        if user not in instance.upvoted_by.all():
            instance.upvoted_by.add(user)
            instance.upvotes += 1
            instance.save()
        return instance


class DownvotePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = []

    def update(self, instance, validated_data):
        user = self.context["request"].user
        if user in instance.upvoted_by.all():
            instance.upvoted_by.remove(user)
            instance.upvotes = F("upvotes") - 1
        if user not in instance.downvoted_by.all():
            instance.downvoted_by.add(user)
            instance.downvotes = F("downvotes") + 1
        else:
            instance.downvoted_by.remove(user)
            instance.downvotes = F("downvotes") - 1

        instance.save()
        instance.refresh_from_db()
        return instance


class BasePostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source="author.username")
    is_bookmarked = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()
    view_count = serializers.SerializerMethodField()
    is_upvoted = serializers.SerializerMethodField()
    replies_count = serializers.IntegerField(read_only=True)
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "author_username",
            "is_bookmarked",
            "created_at",
            "updated_at",
            "view_count",
            "upvotes",
            "downvotes",
            "is_upvoted",
            "replies_count",
            "avatar",
        ]
        read_only_fields = ["id", "slug", "author_username", "created_at", "updated_at"]

    def get_avatar(self, obj) -> str | None:
        if obj.author.profile.avatar:
            return obj.author.profile.avatar.url
        return None

    def get_is_bookmarked(self, obj) -> bool:
        user = self.context["request"].user
        if user.is_authenticated:
            return obj.bookmarked_by.filter(id=user.id).exists()
        return False

    def get_created_at(self, obj):
        now = obj.created_at
        formatted_date = now.strftime("%Y-%m-%d %H:%M:%S")
        return formatted_date

    def get_updated_at(self, obj):
        then = obj.updated_at
        formatted_date = then.strftime("%Y-%m-%d %H:%M:%S")
        return formatted_date

    def get_view_count(self, obj):
        content_type = ContentType.objects.get_for_model(obj)
        return ContentView.objects.filter(
            content_type=content_type, object_id=obj.pkid
        ).count()

    def get_is_upvoted(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            return obj.upvoted_by.filter(id=user.id).exists()
        return False


class PostSerializer(TaggitSerializer, BasePostSerializer):
    tags = TagListSerializerField()
    replies = ReplySerializer(many=True, read_only=True)

    class Meta(BasePostSerializer.Meta):
        fields = BasePostSerializer.Meta.fields + ["body", "tags", "replies"]

    def create(self, validated_data) -> Post:
        tags = validated_data.pop("tags")
        user = self.context["request"].user
        post = Post.objects.create(author=user, **validated_data)
        post.tags.set(tags)
        return post

    def update(self, instance, validated_data) -> Post:
        tags = validated_data.pop("tags", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if tags is not None:
            instance.tags.set(tags)
        instance.save()
        return instance


class PostByTagSerializer(TaggitSerializer, BasePostSerializer):
    tags = TagListSerializerField()

    class Meta(BasePostSerializer.Meta):
        fields = BasePostSerializer.Meta.fields + ["body", "tags"]
