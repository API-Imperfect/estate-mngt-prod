import * as z from "zod";

export const replyCreateSchema = z.object({
	body: z.string().min(1, "Add a reply"),
});

export type TReplyCreateSchema = z.infer<typeof replyCreateSchema>;
