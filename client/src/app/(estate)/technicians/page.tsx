import TechnicianCard from "@/components/cards/TechnicianCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Alpha Apartments | Technicians",
	description:
		"Tenants can see a list of technicians, what they specialize on and their rating",
};

export default function TechniciansPage() {
	return (
		<>
			<TechnicianCard />
		</>
	);
}
