"use client";

import { useGetAllTechniciansQuery } from "@/lib/redux/features/users/usersApiSlice";
import { useAppSelector } from "@/lib/redux/hooks/typedHooks";
import { UserState } from "@/types";
import { useTheme } from "next-themes";
import Spinner from "../shared/Spinner";
import UsersSearch from "../shared/search/UsersSearch";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import TechnicianCardDetails from "./TechnicianCardDetails";
import Link from "next/link";
import { Button } from "../ui/button";
import PaginationSection from "../shared/PaginationSection";

export default function TechnicianCard() {
	const { theme } = useTheme();
	const searchTerm = useAppSelector(
		(state: UserState) => state.user.searchTerm,
	);
	const page = useAppSelector((state: UserState) => state.user.page);
	const { data, isLoading } = useGetAllTechniciansQuery({ searchTerm, page });
	const technicians = data?.non_tenant_profiles;

	const totalCount = technicians?.count || 0;
	const totalPages = Math.ceil(totalCount / 9);

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
			<h1 className="flex-center font-robotoSlab dark:text-pumpkin text-5xl">
				All Technicians - ({technicians?.results.length})
			</h1>

			<div className="mt-4 grid cursor-pointer grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{technicians && technicians.results.length > 0 ? (
					technicians.results.map((technician) => (
						<Card key={technician.id}>
							<CardContent className="dark:border-gray rounded-lg border">
								<CardHeader className="flex-center w-full">
									<Avatar>
										<AvatarImage
											className="rounded-full"
											alt="User Profile Avatar"
											src={
												technician.avatar ||
												(theme === "dark"
													? "/assets/icons/user-profile-circle.svg"
													: "/assets/icons/user-profile-light-circle.svg")
											}
											width={100}
											height={100}
										/>
									</Avatar>
									<CardTitle className="flex-center h2-semibold font-robotoSlab dark:text-pumpkin">
										{technician.full_name}
									</CardTitle>
								</CardHeader>
								<CardTitle className="flex-center">
									<p className="h4-semibold dark:text-lime-500">
										@{technician.username}
									</p>
								</CardTitle>
								<CardDescription className="mt-2 grid">
									<TechnicianCardDetails
										country_of_origin={technician.country_of_origin}
										occupation={technician.occupation}
										date_joined={technician.date_joined}
										average_rating={technician.average_rating}
									/>
								</CardDescription>
								<div className="flex-center">
									<Link href={`/add-rating?username=${technician.username}`}>
										<Button
											size="sm"
											className="electricIndigo-gradient text-babyPowder mt-3"
										>
											Give me a Rating
										</Button>
									</Link>
								</div>
							</CardContent>
						</Card>
					))
				) : (
					<p className="h2-semibold dark:text-lime-500">
						No technicians(s) found!
					</p>
				)}
			</div>
			<PaginationSection totalPages={totalPages} entityType="user" />
		</div>
	);
}
