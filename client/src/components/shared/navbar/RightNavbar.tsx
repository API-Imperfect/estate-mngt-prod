"use client";

import { useGetTopPostsQuery } from "@/lib/redux/features/posts/postApiSlice";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function RightNavbar() {
	const { data } = useGetTopPostsQuery();
	const topPosts = data?.top_posts.results;
	return (
		<section className="bg-baby_rich light-border custom-scrollbar shadow-platinum sticky right-0 top-0 flex h-screen w-[280px] flex-col justify-between overflow-y-auto border-l p-6 pt-36 max-xl:hidden dark:shadow-none">
			<div>
				<h3 className="h3-semibold dark:text-pumpkin">Top Posts</h3>
				<div className="mt-7 flex w-full flex-col gap-[30px]">
					{topPosts && topPosts.length > 0 ? (
						topPosts.map((post) => (
							<Link
								key={post.id}
								href={`/post/${post.slug}`}
								className="flex cursor-pointer items-center justify-between gap-7"
							>
								<p className="hover:text-electricIndigo dark:text-platinum dark:hover:text-lime-500">
									{post.title.length > 20
										? `${post.title.substring(0, 20)}....`
										: post.title}
								</p>
								<ChevronRight className="tab-icon text-pumpkin" />
							</Link>
						))
					) : (
						<p className="h2-semibold dark:text-lime-500">
							No Top Posts found!
						</p>
					)}
				</div>
			</div>
		</section>
	);
}
