"use client";

import { useGetMyAssignedIssuesQuery } from "@/lib/redux/features/issues/issueApiSlice";
import React from "react";
import Spinner from "../shared/Spinner";
import { TabsContent } from "../ui/tabs";
import IssueCard from "../cards/IssueCard";

export default function AssignedIssues() {
	const { data: assignedIssues, isLoading } = useGetMyAssignedIssuesQuery("");

	const myAssignedIssues = assignedIssues?.assigned_issues;

	if (isLoading) {
		return (
			<div className="flex-center pt-32">
				<Spinner size="xl" />
			</div>
		);
	}

	return (
		<TabsContent value="assigned-issues">
			<h2 className="h2-semibold flex-center font-robotoSlab dark:text-pumpkin text-xl">
				Total: ({myAssignedIssues?.count})
			</h2>
			<div className="mt-4 grid cursor-pointer grid-cols-1 gap-4 p-1.5 md:grid-cols-2 lg:grid-cols-3">
				{myAssignedIssues && myAssignedIssues.results.length > 0 ? (
					myAssignedIssues.results.map((issue) => (
						<IssueCard key={issue.id} issue={issue} />
					))
				) : (
					<p className="h2-semibold dark:text-lime-500">
						No Issue(s) Assigned to you Yet!
					</p>
				)}
			</div>
		</TabsContent>
	);
}
