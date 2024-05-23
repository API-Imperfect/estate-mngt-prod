"use client";
import { useGetAllUsersQuery } from "@/lib/redux/features/users/usersApiSlice";
import { useTheme } from "next-themes";

import React from "react";
import Spinner from "../shared/Spinner";
import UsersSearch from "../shared/search/UsersSearch";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import TenantInfo from "./TenantInfo";
import {
	BrickWall,
	Briefcase,
	Building,
	CalendarDays,
	Map,
	School,
} from "lucide-react";
import { formatDate } from "@/utils";
import ProtectedRoute from "../shared/ProtectedRoutes";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useAppSelector } from "@/lib/redux/hooks/typedHooks";

function TenantCardContent() {
	const { theme } = useTheme();
	const searchTerm = useAppSelector((state) => state.user.searchTerm);
	const { data, isLoading } = useGetAllUsersQuery({ searchTerm });

	if (isLoading) {
		return (
			<div className="flex-center pt-32">
				<Spinner size="xl" />
			</div>
		);
	}

	return (
		<div>
			<UsersSearch />
			<h1 className="flex-center font-robotoSlab dark:text-pumpkin text-4xl sm:text-5xl">
				All Tenants - ({data?.profiles.results.length})
			</h1>

			<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
				{data && data.profiles.results.length > 0 ? (
					data.profiles.results.map((tenant) => (
						<Card key={tenant.id}>
							<CardContent className="rounded-lg p-4">
								<CardHeader className="flex-col-center text-center">
									<Avatar className="border-pumpkin mx-auto size-28 overflow-hidden rounded-full border-4 object-cover">
										<AvatarImage
											alt="User profile avatar"
											src={
												tenant.avatar ||
												(theme === "dark"
													? "/assets/icons/user-profile-circle.svg"
													: "/assets/icons/user-profile-light-circle.svg")
											}
										/>
									</Avatar>
									<CardTitle className="h3-semibold font-robotoSlab dark:text-platinum">
										{tenant.full_name}
									</CardTitle>
								</CardHeader>
								<CardTitle className="flex-center">
									<p className="h4-semibold dark:text-lime-500">
										@{tenant.username}
									</p>
								</CardTitle>
								<CardDescription className="mt-4 space-y-2 border-b-0">
									<div>
										<TenantInfo
											label="Country of Origin"
											value={tenant.country_of_origin}
											icon={Map}
										/>
										<TenantInfo
											label="Occupation"
											value={tenant.occupation}
											icon={Briefcase}
										/>
										<TenantInfo
											label="Date Joined"
											value={formatDate(tenant.date_joined).toString()}
											icon={CalendarDays}
										/>
									</div>
									{tenant.apartment && (
										<>
											<TenantInfo
												label="Building"
												value={tenant.apartment.building}
												icon={Building}
											/>
											<TenantInfo
												label="Apartment Floor"
												value={tenant.apartment.floor}
												icon={School}
											/>
											<TenantInfo
												label="Unit Number"
												value={tenant.apartment.unit_number}
												icon={BrickWall}
											/>
										</>
									)}
								</CardDescription>
							</CardContent>
						</Card>
					))
				) : (
					<p>No tenants found</p>
				)}
			</div>
		</div>
	);
}

export default function TenantCard() {
	return (
		<ProtectedRoute>
			<TenantCardContent />
		</ProtectedRoute>
	);
}
