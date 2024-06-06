"use client";

import {
	useBookmarkPostMutation,
	useDownvotePostMutation,
	useGetSinglePostQuery,
	useUpvotePostMutation,
} from "@/lib/redux/features/posts/postApiSlice";
import { toast } from "react-toastify";
import { Card, CardHeader } from "../ui/card";
import { AuthFormHeader } from "../forms/auth";
import PostHeader from "./PostHeader";
import PostActions from "./PostActions";
import PostBody from "./PostBody";
import PostFooter from "./PostFooter";
import ProtectedRoute from "../shared/ProtectedRoutes";

interface PostDetailsProps {
	params: {
		slug: string;
	};
}

function PostDetailsContent({ params }: PostDetailsProps) {
	const slug = params.slug;
	const { data } = useGetSinglePostQuery(slug);
	const post = data?.post;

	const [upvotePost, { isLoading: isUpvoteLoading }] = useUpvotePostMutation();
	const [downvotePost, { isLoading: isDownvoteLoading }] =
		useDownvotePostMutation();
	const [bookmarkPost, { isLoading: isBookmarkLoading }] =
		useBookmarkPostMutation();

	const handleUpvote = () => {
		post?.id && upvotePost(post.id);
		toast.success("Post Upvoted 😋");
	};

	const handleDownVote = () => {
		post?.id && downvotePost(post.id);
		toast.success("Post Downvoted 🥺");
	};

	const handleBookmarkPost = () => {
		post?.slug && bookmarkPost(post.slug);
		toast.success("This post has been added to your Bookmarks");
	};

	return (
		<Card className="dark:border-gray rounded-xl border border-dashed">
			<AuthFormHeader
				title={post?.title}
				linkText="Go back to Home"
				linkHref="/welcome"
			/>
			<CardHeader className="flex-start border-b-eerieBlack dark:border-gray w-full flex-col border-b border-dashed">
				<div className="flex w-full flex-col justify-between sm:flex-row sm:items-center sm:gap-2">
					<PostHeader
						title={post?.title}
						avatar={post?.avatar}
						author_username={post?.author_username}
						created_at={post?.created_at}
						view_count={post?.view_count}
					/>
					<PostActions
						upvotes={post?.upvotes}
						downvotes={post?.downvotes}
						handleUpvote={handleUpvote}
						handleDownVote={handleDownVote}
						handleBookmarkPost={handleBookmarkPost}
						isUpvoteLoading={isUpvoteLoading}
						isDownvoteLoading={isDownvoteLoading}
						isBookmarkLoading={isBookmarkLoading}
					/>
				</div>
			</CardHeader>
			<PostBody body={post?.body} slug={post?.slug} />
			<PostFooter tags={post?.tags} replies_count={post?.replies_count} />
		</Card>
	);
}

export default function PostDetails({ params }: PostDetailsProps) {
	return (
		<ProtectedRoute>
			<PostDetailsContent params={params} />
		</ProtectedRoute>
	);
}
