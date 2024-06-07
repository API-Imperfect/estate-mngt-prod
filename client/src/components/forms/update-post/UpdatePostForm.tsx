"use client";

import {
	useGetSinglePostQuery,
	useUpdatePostMutation,
} from "@/lib/redux/features/posts/postApiSlice";
import { postUpdateSchema, TPostUpdateSchema } from "@/lib/validationSchemas";
import { extractErrorMessage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
import { FormFieldComponent } from "../FormFieldComponent";
import { Text } from "lucide-react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";

interface UpdateParamsProps {
	params: {
		slug: string;
	};
}

export default function UpdatePostForm({ params }: UpdateParamsProps) {
	const postSlug = params.slug;
	const { data } = useGetSinglePostQuery(postSlug);
	const post = data?.post;
	const [updatePost, { isLoading }] = useUpdatePostMutation();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TPostUpdateSchema>({
		resolver: zodResolver(postUpdateSchema),
	});

	useEffect(() => {
		if (post) {
			reset({
				...post,
			});
		}
	}, [post, reset]);

	const onSubmit = async (formValues: z.infer<typeof postUpdateSchema>) => {
		try {
			await updatePost({ postSlug, ...formValues }).unwrap();
			toast.success("Post updated successfully");
			router.push(`/post/${postSlug}`);
		} catch (error) {
			toast.error(extractErrorMessage(error) || "Failed to update post");
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
					startIcon={<Text className="dark:text-babyPowder size-8" />}
				/>

				<FormFieldComponent
					label="Content"
					name="body"
					register={register}
					errors={errors}
					isTextArea
				/>

				<Button
					type="submit"
					className="h4-semibold bg-eerieBlack dark:bg-pumpkin w-full text-white"
					disabled={isLoading}
				>
					{isLoading ? <Spinner size="sm" /> : `Update Your Post`}
				</Button>
			</form>
		</main>
	);
}
