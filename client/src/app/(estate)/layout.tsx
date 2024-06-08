import LeftNavbar from "@/components/shared/navbar/LeftNavbar";
import Navbar from "@/components/shared/navbar/Navbar";
import RightNavbar from "@/components/shared/navbar/RightNavbar";
import React from "react";

interface LayoutProps {
	children: React.ReactNode;
}

export default function layout({ children }: LayoutProps) {
	return (
		<main className="bg-baby_veryBlack relative">
			<Navbar />
			<div className="flex">
				{/* placeholder LeftNavbar component */}
				<LeftNavbar />
				<section className="flex min-h-screen flex-1 flex-col px-4 pb-6 pt-24 sm:px-6 lg:px-8 lg:pt-32">
					<div>{children}</div>
				</section>
				{/* placeholder right navbar component */}
				<RightNavbar />
			</div>
		</main>
	);
}
