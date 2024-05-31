import {
	BookmarkedPostsResponse,
	BookmarkResponse,
	MyPostsResponse,
	PopularTagResponse,
	PostData,
	PostQueryParams,
	PostResponse,
	PostsByTagResponse,
	PostsResponse,
	ReplyPostData,
	ReplyResponse,
	TopPostsResponse,
	UpdatePostData,
	UpvoteDownvoteResponse,
} from "@/types";
import { baseApiSlice } from "../api/baseApiSlice";

export const postApiSlice = baseApiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createPost: builder.mutation<PostResponse, PostData>({
			query: (postData) => ({
				url: "/posts/create/",
				method: "POST",
				body: postData,
			}),
			invalidatesTags: ["Post"],
		}),
		getAllPosts: builder.query<PostsResponse, PostQueryParams>({
			query: (params = {}) => {
				const queryString = new URLSearchParams();

				if (params.page) {
					queryString.append("page", params.page.toString());
				}
				return `/posts/?${queryString.toString()}`;
			},
			providesTags: ["Post"],
		}),
		getMyPosts: builder.query<MyPostsResponse, void>({
			query: () => "/posts/my-posts/",
			providesTags: ["Post"],
		}),
		getSinglePost: builder.query<PostResponse, string>({
			query: (postSlug) => `/posts/${postSlug}/`,
			providesTags: ["Post"],
		}),
		updatePost: builder.mutation<PostResponse, UpdatePostData>({
			query: ({ postSlug, ...postData }) => ({
				url: `/posts/${postSlug}/update/`,
				method: "PATCH",
				body: postData,
			}),
			invalidatesTags: ["Post"],
		}),
		upvotePost: builder.mutation<UpvoteDownvoteResponse, string>({
			query: (postId) => ({
				url: `/posts/${postId}/upvote/`,
				method: "PATCH",
			}),
			invalidatesTags: ["Post"],
		}),
		downvotePost: builder.mutation<UpvoteDownvoteResponse, string>({
			query: (postId) => ({
				url: `/posts/${postId}/downvote/`,
				method: "PATCH",
			}),
			invalidatesTags: ["Post"],
		}),
		bookmarkPost: builder.mutation<BookmarkResponse, string>({
			query: (postSlug) => ({
				url: `/posts/${postSlug}/bookmark/`,
				method: "PATCH",
			}),
			invalidatesTags: ["Post"],
		}),
		unBookmarkPost: builder.mutation<BookmarkResponse, string>({
			query: (postSlug) => ({
				url: `/posts/${postSlug}/unbookmark/`,
				method: "PATCH",
			}),
			invalidatesTags: ["Post"],
		}),
		getAllMyBookmarks: builder.query<BookmarkedPostsResponse, void>({
			query: () => "/posts/bookmarked/posts/",
			providesTags: ["Post"],
		}),
		getTopPosts: builder.query<TopPostsResponse, void>({
			query: () => "/posts/top-posts/",
			providesTags: ["Post"],
		}),
		getPopularTags: builder.query<PopularTagResponse, void>({
			query: () => "/posts/popular-tags/",
			providesTags: ["Post"],
		}),
		getAllReplies: builder.query<PostResponse, string>({
			query: (postId) => `/posts/${postId}/replies/`,
			providesTags: ["Post"],
		}),
		getPostsByTag: builder.query<PostsByTagResponse, string>({
			query: (tagSlug) => `/posts/tags/${tagSlug}/`,
			providesTags: ["Post"],
		}),
		replyToPost: builder.mutation<ReplyResponse, ReplyPostData>({
			query: ({ postId, ...replyData }) => ({
				url: `/posts/${postId}/reply/`,
				method: "POST",
				body: replyData,
			}),
			invalidatesTags: ["Post"],
		}),
	}),
});

export const {
	useCreatePostMutation,
	useGetAllPostsQuery,
	useGetAllMyBookmarksQuery,
	useGetPostsByTagQuery,
	useGetMyPostsQuery,
	useGetTopPostsQuery,
	useGetPopularTagsQuery,
	useGetSinglePostQuery,
	useUpvotePostMutation,
	useDownvotePostMutation,
	useUpdatePostMutation,
	useBookmarkPostMutation,
	useUnBookmarkPostMutation,
	useReplyToPostMutation,
	useGetAllRepliesQuery,
} = postApiSlice;
