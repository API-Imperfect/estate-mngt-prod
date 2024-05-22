import TenantCard from "@/components/cards/TenantCard";
import ProtectedRoute from "@/components/shared/ProtectedRoutes";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Alpha Apartments | Tenants",
	description:
		"Authenticated users can view basic information about other tenants within the property. Tenants can also search for other tenants",
};

function TenantsPageContent() {
	return (
		<div>
			<TenantCard />
		</div>
	);
}

export default function TenantsPage() {
	return (
		<ProtectedRoute>
			<TenantsPageContent />
		</ProtectedRoute>
	);
}
