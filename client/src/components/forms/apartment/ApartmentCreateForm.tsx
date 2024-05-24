"use client";
import { useCreateApartmentMutation } from "@/lib/redux/features/apartment/apartmentApiSlice";
import {
	apartmentCreateSchema,
	TApartmentCreateSchema,
} from "@/lib/validationSchemas";
import { extractErrorMessage } from "@/utils";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
import { FormFieldComponent } from "../FormFieldComponent";
import { BuildingOfficeIcon, HomeIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ApartmentCreateForm() {
	const [createApartment, { isLoading }] = useCreateApartmentMutation();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<TApartmentCreateSchema>({
		resolver: zodResolver(apartmentCreateSchema),
		mode: "all",
		defaultValues: {
			unit_number: "",
			building: "",
			floor: 1,
		},
	});

	const onSubmit = async (values: z.infer<typeof apartmentCreateSchema>) => {
		try {
			await createApartment(values).unwrap();
			toast.success("Apartment Added");
			router.push("/profile");
			reset();
		} catch (error) {
			const errorMessage = extractErrorMessage(error);
			toast.error(errorMessage || "An error occurred");
		}
	};
	return (
		<main>
			<form
				noValidate
				onSubmit={handleSubmit(onSubmit)}
				className="flex w-full max-w-md flex-col gap-4"
			>
				<FormFieldComponent
					label="Building"
					name="building"
					register={register}
					errors={errors}
					placeholder="Building Name"
					startIcon={
						<BuildingOfficeIcon className="dark:text-babyPowder size-8" />
					}
				/>

				<FormFieldComponent
					label="Apartment Unit Number"
					name="unit_number"
					register={register}
					errors={errors}
					placeholder="Apartment Number"
					startIcon={<HomeIcon className="dark:text-babyPowder size-8" />}
				/>
				<label htmlFor="floor" className="h4-semibold dark:text-babyPowder">
					Apartment Floor
				</label>
				<Controller
					name="floor"
					control={control}
					render={({ field }) => (
						<input
							{...field}
							id="floor"
							type="number"
							onChange={(e) => field.onChange(parseInt(e.target.value))}
							className="flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						/>
					)}
				/>
				{errors.floor && (
					<p className="text-sm text-red-500">{errors.floor.message}</p>
				)}

				<Button
					type="submit"
					className="h4-semibold bg-eerieBlack dark:bg-pumpkin w-full text-white"
					disabled={isLoading}
				>
					{isLoading ? <Spinner size="sm" /> : `Add Your Apartment`}
				</Button>
			</form>
		</main>
	);
}
