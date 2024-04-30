from django.contrib.contenttypes.models import ContentType
from django.db.models import Count
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from core_apps.common.models import ContentView
from core_apps.common.renderers import GenericJSONRenderer
from .filters import PostFilter
from .models import Post, Reply
from .permissions import CanCreateEditPost
from .serializers import (
    DownvotePostSerializer,
    PopularTagSerializer,
    PostSerializer,
    ReplySerializer,
    TopPostSerializer,
    UpvotePostSerializer,
    PostByTagSerializer,
)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = "page_size"
    max_page_size = 100


class PostListAPIView(generics.ListAPIView):
    serializer_class = PostSerializer
    filterset_class = PostFilter
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.AllowAny]
    renderer_classes = [GenericJSONRenderer]
    object_label = "posts"

    def get_queryset(self):
        return Post.objects.annotate(replies_count=Count("replies")).order_by(
            "-upvotes", "-created_at"
        )


class MyPostListAPIView(generics.ListAPIView):
    serializer_class = PostSerializer
    filterset_class = PostFilter
    renderer_classes = [GenericJSONRenderer]
    object_label = "my_posts"

    def get_queryset(self):
        return Post.objects.filter(author=self.request.user).order_by(
            "-upvotes", "-created_at"
        )


class PostDetailAPIView(generics.RetrieveAPIView):
    serializer_class = PostSerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "post"
    lookup_field = "slug"

    def get_queryset(self):
        return Post.objects.annotate(replies_count=Count("replies"))

    def get_object(self) -> Post:
        queryset = self.get_queryset()
        filter_kwargs = {self.lookup_field: self.kwargs[self.lookup_field]}
        post = generics.get_object_or_404(queryset, **filter_kwargs)
        self.record_post_view(post)
        return post

    def record_post_view(self, post):
        content_type = ContentType.objects.get_for_model(post)
        viewer_ip = self.get_client_ip()
        user = self.request.user

        obj, created = ContentView.objects.update_or_create(
            content_type=content_type,
            object_id=post.pk,
            user=user,
            viewer_ip=viewer_ip,
            defaults={"last_viewed": timezone.now()},
        )

    def get_client_ip(self) -> str:
        x_forwarded_for = self.request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0]
        else:
            ip = self.request.META.get("REMOTE_ADDR")
        return ip


class PostCreateAPIView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    renderer_classes = [GenericJSONRenderer]
    permission_classes = [CanCreateEditPost]
    object_label = "post"

    def perform_create(self, serializer) -> None:
        serializer.save()


class PostUpdateAPIView(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    renderer_classes = [GenericJSONRenderer]
    permission_classes = [CanCreateEditPost]
    object_label = "post"
    lookup_field = "slug"

    def get_object(self):
        post = super().get_object()
        if post.author != self.request.user:
            raise PermissionDenied("You do not have permission to edit this post.")
        return post

    def perform_update(self, serializer):
        super().perform_update(serializer)
        self.post_instance = serializer.instance

    def update(self, request, *args, **kwargs):
        super().update(request, *args, **kwargs)
        post_with_replies_count = Post.objects.annotate(
            replies_count=Count("replies")
        ).get(pk=self.post_instance.pk)
        response_data = self.get_serializer(post_with_replies_count).data
        return Response(response_data)


class BookmarkPostAPIView(APIView):
    def patch(self, request, slug):
        user = request.user
        post = get_object_or_404(Post, slug=slug)

        if user in post.bookmarked_by.all():
            return Response(
                {"message": "Post already bookmarked"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        post.bookmarked_by.add(user)
        return Response({"message": "Post bookmarked"}, status=status.HTTP_200_OK)


class UnBookmarkPostAPIView(APIView):
    def patch(self, request, slug):
        user = request.user
        post = get_object_or_404(Post, slug=slug)

        if user not in post.bookmarked_by.all():
            return Response(
                {
                    "message": "You can't remove a bookmark that did not exist in the first place "
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        post.bookmarked_by.remove(user)
        return Response({"message": "Post Bookmark Removed"}, status=status.HTTP_200_OK)


class BookmarkedPostListAPIView(generics.ListAPIView):
    serializer_class = PostSerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "bookmarked_posts"

    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(bookmarked_by=user)


class ReplyCreateAPIView(generics.CreateAPIView):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "reply"

    def perform_create(self, serializer):
        post_id = self.kwargs.get("post_id")
        post = get_object_or_404(Post, id=post_id)
        user = self.request.user
        serializer.save(author=user, post=post)


class ReplyListAPIView(generics.ListAPIView):
    serializer_class = ReplySerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "replies"

    def get_queryset(self):
        post_id = self.kwargs.get("post_id")

        return Reply.objects.filter(post__id=post_id).order_by("-created_at")


class UpvotePostAPIView(APIView):
    def patch(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        serializer = UpvotePostSerializer(
            post, data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Post upvoted successfully!"}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DownvotePostAPIView(APIView):
    def patch(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        serializer = DownvotePostSerializer(post, data={}, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Post downvoted successfully!"}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PopularTagsListAPIView(generics.ListAPIView):
    serializer_class = PopularTagSerializer
    renderer_classes = [GenericJSONRenderer]
    permission_classes = [permissions.AllowAny]
    object_label = "popular_tags"

    def get_queryset(self):
        return Post.get_popular_tags()


class TopPostsListAPIView(generics.ListAPIView):
    serializer_class = TopPostSerializer
    renderer_classes = [GenericJSONRenderer]
    permission_classes = [permissions.AllowAny]
    object_label = "top_posts"

    def get_queryset(self):
        queryset = Post.objects.annotate(
            replies_count=Count("replies"),
            view_count=Count("content_views"),
        ).order_by("-upvotes", "-view_count", "-replies_count")[:6]
        return queryset


class PostsByTagListAPIView(generics.ListAPIView):
    serializer_class = PostByTagSerializer
    renderer_classes = [GenericJSONRenderer]
    permission_classes = [permissions.AllowAny]
    object_label = "posts_by_tag"

    def get_queryset(self):
        tag_slug = self.kwargs.get("tag_slug")
        return Post.objects.filter(tags__slug=tag_slug).annotate(
            replies_count=Count("replies")
        )
