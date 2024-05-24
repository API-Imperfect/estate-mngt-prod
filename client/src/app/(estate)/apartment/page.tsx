import ApartmentCreateForm from "@/components/forms/apartment/ApartmentCreateForm";
import { AuthFormHeader } from "@/components/forms/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Alpha Apartments | Create Apartment",
	description: "Authenticated users can add their apartment details",
};

export default function AddApartmentPage() {
	return (
		<div>
			<AuthFormHeader
				title="Add Your Apartment"
				staticText="Want to go back?"
				linkText="Back to Profile"
				linkHref="/profile"
			/>
			<div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
				<div className="bg-lightGrey dark:bg-deepBlueGrey rounded-xl px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
					<ApartmentCreateForm />
				</div>
			</div>
		</div>
	);
}
