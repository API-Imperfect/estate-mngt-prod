"use client";

import { useGetAllPostsQuery } from "@/lib/redux/features/posts/postApiSlice";
import { useAppSelector } from "@/lib/redux/hooks/typedHooks";
import { PostState } from "@/types";
import {
	formatDate,
	getRepliesText,
	getViewText,
	sortByDateDescending,
} from "@/utils";
import Spinner from "../shared/Spinner";
import Link from "next/link";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { formatDistanceToNow, parseISO } from "date-fns";
import { EyeIcon, MessageSquareQuoteIcon } from "lucide-react";
import PaginationSection from "../shared/PaginationSection";

export default function PostCard() {
	const page = useAppSelector((state: PostState) => state.post.page);
	const { data, isLoading } = useGetAllPostsQuery({ page });

	const totalCount = data?.posts.count || 0;
	const totalPages = Math.ceil(totalCount / 9);

	const sortedPosts = sortByDateDescending(
		data?.posts.results ?? [],
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
		<>
			<div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="font-robotoSlab dark:text-pumpkin text-5xl">
					All Posts - ({data?.posts.results.length})
				</h1>

				<Link href="/add-post" className="flex justify-end max-sm:w-full">
					<Button className="h3-semibold electricIndigo-gradient text-babyPowder min-h-[46px] px-4 py-3">
						Create a Post
					</Button>
				</Link>
			</div>

			<div className="mt-7 grid grid-cols-2 gap-6">
				{sortedPosts && sortedPosts.length > 0 ? (
					sortedPosts.map((postItem) => (
						<Card
							key={postItem.id}
							className="dark:border-gray rounded-lg border"
						>
							<CardHeader className="dark:text-platinum w-full pb-4">
								<CardTitle className="font-robotSlab text-center text-2xl">
									{postItem.title.length > 25
										? `${postItem.title.substring(0, 25)}....`
										: postItem.title}
								</CardTitle>
								<CardDescription>
									<div className="flex flex-row justify-between">
										<div>
											<span>Posted on</span>
											<span className="dark:text-pumpkin ml-1">
												{formatDate(postItem.created_at).toString()}
											</span>
										</div>
									</div>

									<div>
										<span>Last Updated</span>
										<span className="dark:text-pumpkin ml-1">
											{formatDistanceToNow(parseISO(postItem.updated_at), {
												addSuffix: true,
											})}
										</span>
									</div>
								</CardDescription>
							</CardHeader>

							<CardContent className="border-t-deepBlueGrey dark:border-gray border-y py-4 text-sm">
								<p className="dark:text-platinum">
									{postItem.body.length > 65
										? `${postItem.body.substring(0, 65)}....`
										: postItem.body}
								</p>
							</CardContent>

							<div className="flex flex-row items-center justify-between p-2">
								<div className="">
									<Link href={`/post/${postItem.slug}`}>
										<Button size="sm" className="lime-gradient text-babyPowder">
											View Post
										</Button>
									</Link>
								</div>

								<div className="flex-row-center dark:text-platinum">
									<EyeIcon className="post-icon text-electricIndigo mr-1" />
									{getViewText(postItem.view_count)}
								</div>

								<div className="flex-row-center dark:text-platinum">
									<MessageSquareQuoteIcon className="post-icon text-electricIndigo mr-1" />
									<span>{getRepliesText(postItem.replies_count)}</span>
								</div>
							</div>
						</Card>
					))
				) : (
					<p className="h2-semibold dark:text-lime-500">No Posts Found!</p>
				)}
			</div>

			<PaginationSection totalPages={totalPages} entityType="post" />
		</>
	);
}
