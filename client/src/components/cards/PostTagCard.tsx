"use client";

import { useGetPostsByTagQuery } from "@/lib/redux/features/posts/postApiSlice";
import Spinner from "../shared/Spinner";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { formatDate, getRepliesText, getViewText } from "@/utils";
import { formatDistanceToNow, parseISO } from "date-fns";
import Link from "next/link";
import { Button } from "../ui/button";
import { EyeIcon, MessageSquareQuoteIcon } from "lucide-react";

interface SlugParamsProps {
	params: {
		tagSlug: string;
	};
}

export default function PostTagCard({ params }: SlugParamsProps) {
	const { data, isLoading } = useGetPostsByTagQuery(params.tagSlug);
	if (isLoading) {
		return (
			<div className="flex-center pt-32">
				<Spinner size="xl" />
			</div>
		);
	}

	const posts = data?.posts_by_tag.results || [];

	return (
		<div>
			<h1 className="flex-center font-robotoSlab dark:text-pumpkin text-4xl">
				Posts tagged with{" "}
				<span className="text-electricIndigo ml-1 dark:text-lime-500">
					&ldquo;{params.tagSlug}&rdquo;
				</span>
			</h1>
			<div className="mt-6 grid grid-cols-2 gap-6">
				{posts.map((post) => (
					<Card key={post.id} className="dark:border-gray rounded-lg border">
						<CardHeader className="dark:text-platinum w-full pb-4">
							<CardTitle className="font-robotoSlab text-center text-2xl">
								{post.title.length > 25
									? `${post.title.substring(0, 25)}....`
									: post.title}
							</CardTitle>
							<CardDescription>
								<div className="flex flex-row justify-between">
									<div>
										<span>Posted on</span>
										<span className="dark:text-pumpkin ml-1">
											{formatDate(post.created_at).toString()}
										</span>
									</div>
									<div>
										<span>Last Updated</span>
										<span className="dark:text-pumpkin ml-1">
											{formatDistanceToNow(parseISO(post.updated_at), {
												addSuffix: true,
											})}
										</span>
									</div>
								</div>
							</CardDescription>
						</CardHeader>
						<CardContent className="border-t-deepBlueGrey dark:border-gray border-y py-4 text-sm">
							<p className="dark:text-platinum">
								{post.body.length > 65
									? `${post.body.substring(0, 65)}....`
									: post.body}
							</p>
						</CardContent>

						<div className="flex flex-row items-center justify-between p-2">
							<div>
								<Link href={`/post/${post.slug}`}>
									<Button size="sm" className="lime-gradient text-babyPowder">
										View Post
									</Button>
								</Link>
							</div>
							<div className="flex-row-center dark:text-platinum">
								<EyeIcon className="post-icon text-electricIndigo mr-1" />
								{getViewText(post.view_count)}
							</div>
							<div className="flex-row-center dark:text-platinum">
								<MessageSquareQuoteIcon className="post-icon text-electricIndigo mr-1" />
								<span>{getRepliesText(post.replies_count)}</span>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
