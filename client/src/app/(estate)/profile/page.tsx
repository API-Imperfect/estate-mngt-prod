"use client";

import Spinner from "@/components/shared/Spinner";
import { useGetUserProfileQuery } from "@/lib/redux/features/users/usersApiSlice";
import React from "react";

export default function ProfilePage() {
	const { data, isLoading } = useGetUserProfileQuery();

	if (isLoading) {
		return (
			<div className="flex-center pt-32">
				<Spinner size="xl" />
			</div>
		);
	}
	return (
		<div>
			<h1>{data?.profile.username}&apos;s Profile</h1>
		</div>
	);
}
