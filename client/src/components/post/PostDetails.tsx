"use client";

import {
	useBookmarkPostMutation,
	useDownvotePostMutation,
	useGetSinglePostQuery,
	useUpvotePostMutation,
} from "@/lib/redux/features/posts/postApiSlice";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader } from "../ui/card";
import { AuthFormHeader } from "../forms/auth";
import PostHeader from "./PostHeader";
import PostActions from "./PostActions";
import PostBody from "./PostBody";
import PostFooter from "./PostFooter";
import ProtectedRoute from "../shared/ProtectedRoutes";
import { getRepliesText, sortByDateDescending } from "@/utils";
import { MessageCircleMoreIcon } from "lucide-react";
import RepliesList from "./RepliesList";
import CreateReplyForm from "../forms/add-reply/CreateReplyForm";

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

	const sortedReplies = sortByDateDescending(post?.replies ?? [], "created_at");

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

			<div className="border-b-eerieBlack dark:border-gray dark:text-platinum ml-4 space-y-4 border-b border-dashed py-4">
				<span className="font-robotoSlab dark:text-pumpkin flex flex-row items-center text-lg font-semibold">
					<MessageCircleMoreIcon className="tab-icon text-electricIndigo mr-2" />
					{getRepliesText(post?.replies_count)}
				</span>
				{sortedReplies && sortedReplies.length > 0 ? (
					sortedReplies.map((reply) => (
						<RepliesList key={reply.id} reply={reply} />
					))
				) : (
					<p className="text-lg">This Post does&apos;t have any replies yet</p>
				)}
			</div>

			<CardContent className="border-b-eerieBlack dark:border-gray dark:text-platinum border-b border-dashed">
				<h2 className="h2-semibold dark:text-pumpkin mt-3">
					Add your reply here
				</h2>
				<CreateReplyForm slug={post?.slug} />
			</CardContent>
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
