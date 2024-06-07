import * as z from "zod";

export const postUpdateSchema = z.object({
	title: z.string().trim().min(1, "Title is required"),
	body: z.string().min(1, "Add some content"),
});

export type TPostUpdateSchema = z.infer<typeof postUpdateSchema>;
