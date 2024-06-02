import PostCard from "@/components/cards/PostCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Alpha Apartments | Welcome",
	description:
		"Welcome to the Alpha Apartments Website. This webapp allows users who are tenants to signup, create their profiles, report any issues with their apartments, report any tenants, post anything of relevance for other tenants to see and or respond.",
};

export default function WelcomePage() {
	return (
		<>
			<PostCard />
		</>
	);
}
