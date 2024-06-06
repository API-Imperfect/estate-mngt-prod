import React from "react";
import { CardDescription } from "../ui/card";
import Tooltip from "../shared/Tooltip";
import { BookMarkedIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

interface PostActionsProps {
	upvotes: number | undefined;
	downvotes: number | undefined;
	handleUpvote: () => void;
	handleDownVote: () => void;
	handleBookmarkPost: () => void;
	isUpvoteLoading: boolean;
	isDownvoteLoading: boolean;
	isBookmarkLoading: boolean;
}

export default function PostActions({
	upvotes,
	downvotes,
	handleUpvote,
	handleDownVote,
	handleBookmarkPost,
	isUpvoteLoading,
	isBookmarkLoading,
	isDownvoteLoading,
}: PostActionsProps) {
	return (
		<CardDescription className="mt-2">
			<p className="flex items-center space-x-2">
				<Tooltip content="Upvote this post" position="right">
					<button onClick={handleUpvote} disabled={isUpvoteLoading}>
						<ThumbsUpIcon className="tab-icon text-electricIndigo hidden sm:block" />
					</button>
				</Tooltip>
				<span className="text-xl-font-baby">{upvotes}</span>
				<Tooltip content="Downvote this post">
					<button onClick={handleDownVote} disabled={isDownvoteLoading}>
						<ThumbsDownIcon className="tab-icon text-electricIndigo hidden sm:block" />
					</button>
				</Tooltip>
				<span className="text-xl-font-baby">{downvotes}</span>
				<Tooltip content="Bookmark this post">
					<button onClick={handleBookmarkPost} disabled={isBookmarkLoading}>
						<BookMarkedIcon className="tab-icon text-electricIndigo hidden sm:block" />
					</button>
				</Tooltip>
			</p>
		</CardDescription>
	);
}
