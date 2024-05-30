import { AuthFormHeader } from "@/components/forms/auth";
import CreateReportForm from "@/components/forms/report-tenant/CreateReportForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Alpha Apartments | Report Tenant",
	description:
		"Tenants can report their fellow tenants in cases of misconduct or misbehavior",
};

export default function ReportTenantPage() {
	return (
		<div>
			<AuthFormHeader
				title="Report a Tenant"
				staticText="All reports shall remain anonymous. We shall act accordingly, but shall not discolose details of who raised the concern."
				linkText="Back to Profile"
				linkHref="/profile"
			/>
			<div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
				<div className="bg-lightGrey dark:bg-deepBlueGrey rounded-xl px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
					<CreateReportForm />
				</div>
			</div>
		</div>
	);
}
