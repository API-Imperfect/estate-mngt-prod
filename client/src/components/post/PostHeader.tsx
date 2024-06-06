import { useTheme } from "next-themes";
import React from "react";
import { CardDescription, CardTitle } from "../ui/card";
import { Avatar, AvatarImage } from "../ui/avatar";
import { ClockIcon, EyeIcon } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { getViewText } from "@/utils";

interface PostHeaderProps {
	title: string | undefined;
	avatar: string | undefined;
	author_username: string | undefined;
	created_at: string | undefined;
	view_count: number | undefined;
}

export default function PostHeader({
	avatar,
	author_username,
	created_at,
	view_count,
}: PostHeaderProps) {
	const { theme } = useTheme();

	return (
		<>
			<CardTitle className="dark:text-platinum">
				<p className="flex items-center space-x-2">
					<Avatar>
						<AvatarImage
							src={
								avatar ??
								(theme === "dark"
									? "/assets/icons/user-profile-circle.svg"
									: "/assets/icons/user-profile-light-circle.svg")
							}
							alt="Author Avatar"
							className="border-electricIndigo dark:border-pumpkin size-8 rounded-full border-2 sm:size-10"
						/>
					</Avatar>
					<span className="text-2xl">@{author_username}</span>
				</p>
			</CardTitle>

			<CardDescription className="mt-2">
				<p className="flex items-center space-x-2">
					<ClockIcon className="tab-icon text-electricIndigo hidden sm:block" />
					<span className="text-xl-font-baby">
						<span className="mr-1">Posted</span>
						{created_at
							? formatDistanceToNow(parseISO(created_at), { addSuffix: true })
							: "Loading..."}
					</span>
					<EyeIcon className="tab-icon text-electricIndigo" />
					<span className="text-xl-font-baby">{getViewText(view_count)}</span>
				</p>
			</CardDescription>
		</>
	);
}
