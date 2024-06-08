"use client";

import { useGetAllMyBookmarksQuery } from "@/lib/redux/features/posts/postApiSlice";
import {
	formatDate,
	getRepliesText,
	getViewText,
	sortByDateDescending,
} from "@/utils";
import Spinner from "../shared/Spinner";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { formatDistanceToNow, parseISO } from "date-fns";
import Link from "next/link";
import { Button } from "../ui/button";
import { EyeIcon, MessageSquareQuoteIcon } from "lucide-react";

export default function BookmarkedPostCard() {
	const { data, isLoading } = useGetAllMyBookmarksQuery();
	const bookmarks = data?.bookmarked_posts;

	const sortedBookmarks = sortByDateDescending(
		bookmarks?.results ?? [],
		"created_at",
	);

	if (isLoading) {
		return (
			<div className="flex-center pt-32">
				<Spinner size="xl" />
			</div>
		);
	}
	return (
		<div>
			<h1 className="flex-center font-robotoSlab dark:text-pumpkin mb-3.5 text-5xl">
				My Bookmarks - ({bookmarks?.results.length})
			</h1>

			<div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
				<div className="mt-4 grid grid-cols-2 gap-6">
					{sortedBookmarks && sortedBookmarks.length > 0 ? (
						sortedBookmarks.map((bookmarkItem) => (
							<Card
								key={bookmarkItem.id}
								className="dark:border-gray rounded-lg border"
							>
								<CardHeader className="dark:text-platinum w-full pb-4">
									<CardTitle className="font-robotoSlab text-center text-2xl">
										{bookmarkItem.title.length > 25
											? `${bookmarkItem.title.substring(0, 25)}....`
											: bookmarkItem.title}
									</CardTitle>
									<CardDescription>
										<div className="flex flex-row justify-between">
											<div>
												<span>Posted on</span>
												<span className="dark:text-pumpkin ml-1">
													{formatDate(bookmarkItem.created_at).toString()}
												</span>
											</div>
											<div>
												<span>Last Updated</span>
												<span className="dark:text-pumpkin ml-1">
													{formatDistanceToNow(
														parseISO(bookmarkItem.updated_at),
														{
															addSuffix: true,
														},
													)}
												</span>
											</div>
										</div>
									</CardDescription>
								</CardHeader>
								<CardContent className="border-t-deepBlueGrey dark:border-gray border-y py-4 text-sm">
									<p className="dark:text-platinum">
										{bookmarkItem.body.length > 65
											? `${bookmarkItem.body.substring(0, 65)}....`
											: bookmarkItem.body}
									</p>
								</CardContent>

								<div className="flex flex-row items-center justify-between p-2">
									<div>
										<Link href={`/post/${bookmarkItem.slug}`}>
											<Button
												size="sm"
												className="lime-gradient text-babyPowder"
											>
												View Post
											</Button>
										</Link>
									</div>
									<div className="flex-row-center dark:text-platinum">
										<EyeIcon className="post-icon text-electricIndigo mr-1" />
										{getViewText(bookmarkItem.view_count)}
									</div>

									<div className="flex-row-center dark:text-platinum">
										<MessageSquareQuoteIcon className="post-icon text-electricIndigo mr-1" />
										<span>{getRepliesText(bookmarkItem.replies.length)}</span>
									</div>
								</div>
							</Card>
						))
					) : (
						<p className="h2-semibold dark:text-lime-500">
							No Bookmarks added Yet!
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
