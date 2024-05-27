"use client";

import { useGetMyApartmentQuery } from "@/lib/redux/features/apartment/apartmentApiSlice";
import { useReportIssueMutation } from "@/lib/redux/features/issues/issueApiSlice";
import { issueCreateSchema, TIssueCreateSchema } from "@/lib/validationSchemas";
import { extractErrorMessage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FormFieldComponent } from "../FormFieldComponent";
import { FlagIcon } from "lucide-react";
import Select from "react-select";
import { priorityOptions, statusOptions } from "@/constants";
import customStyles from "../selectStyles";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";

const ClientOnly = dynamic<{ children: React.ReactNode }>(
	() => Promise.resolve(({ children }) => <>{children}</>),
	{ ssr: false },
);

export default function CreateIssueForm() {
	const { data } = useGetMyApartmentQuery();
	const apartment = data?.apartment;

	const [reportIssue, { isLoading }] = useReportIssueMutation();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<TIssueCreateSchema>({
		resolver: zodResolver(issueCreateSchema),
		mode: "all",
	});

	const onSubmit = async (formValues: TIssueCreateSchema) => {
		if (!apartment?.id) {
			toast.error(
				"Create your apartment first in your profile, before creating an issue",
			);
			return;
		}

		const valuesWithApartmentId = {
			...formValues,
			apartmentId: apartment.id,
		};

		try {
			await reportIssue(valuesWithApartmentId).unwrap();
			toast.success(
				"Your Issue has been reported. A confirmation email has been sent to you.",
			);
			reset();
			router.push("/profile");
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
				className="flex w-full max-w-md flex-col gap-4 dark:text-black"
			>
				<FormFieldComponent
					label="Title"
					name="title"
					register={register}
					errors={errors}
					placeholder="Issue Title"
					startIcon={<FlagIcon className="dark:text-babyPowder size-8" />}
				/>
				<FormFieldComponent
					label="Description"
					name="description"
					register={register}
					errors={errors}
					placeholder="Detailed Description of the issue"
					isTextArea
					startIcon={<FlagIcon className="dark:text-babyPowder size-8" />}
				/>
				<div>
					<label htmlFor="Status" className="h4-semibold dark:text-babyPowder">
						Status
					</label>
					<div className="mt-1 flex items-center space-x-3 text-sm">
						<ClientOnly>
							<Controller
								name="status"
								control={control}
								render={({ field: { onChange, onBlur, value } }) => (
									<Select
										className="mt-1 w-full"
										options={statusOptions}
										value={statusOptions.find(
											(option) => option.value === value,
										)}
										onChange={(val) => onChange(val?.value)}
										onBlur={onBlur}
										placeholder="Select Reported if you are reportign an issue"
										instanceId="status-select"
										styles={customStyles}
									/>
								)}
							/>
						</ClientOnly>
					</div>
					{errors.status && (
						<p className="mt-2 text-sm text-red-500">{errors.status.message}</p>
					)}
				</div>

				<div>
					<label htmlFor="Status" className="h4-semibold dark:text-babyPowder">
						Priority
					</label>
					<div className="mt-1 flex items-center space-x-3 text-sm">
						<ClientOnly>
							<Controller
								name="priority"
								control={control}
								render={({ field: { onChange, onBlur, value } }) => (
									<Select
										className="mt-1 w-full"
										options={priorityOptions}
										value={priorityOptions.find(
											(option) => option.value === value,
										)}
										onChange={(val) => onChange(val?.value)}
										onBlur={onBlur}
										placeholder="What priority is your issue?"
										instanceId="priority-select"
										styles={customStyles}
									/>
								)}
							/>
						</ClientOnly>
					</div>
					{errors.priority && (
						<p className="mt-2 text-sm text-red-500">
							{errors.priority.message}
						</p>
					)}
				</div>
				<Button
					type="submit"
					className="h4-semibold bg-eerieBlack dark:bg-pumpkin mt-2 w-full text-white"
					disabled={isLoading}
				>
					{isLoading ? <Spinner size="sm" /> : `Report`}
				</Button>
			</form>
		</main>
	);
}
