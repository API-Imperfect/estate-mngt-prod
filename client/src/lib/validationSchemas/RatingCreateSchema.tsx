import * as z from "zod";

export const ratingCreateSchema = z.object({
	rated_user_username: z.string().trim(),
	rating: z
		.number()
		.nonnegative({ message: "A Rating can't be a negative number" })
		.min(1)
		.max(5),
	comment: z
		.string()
		.min(1, "Give use more context about your choice of rating"),
});

export type TRatingCreateSchema = z.infer<typeof ratingCreateSchema>;
