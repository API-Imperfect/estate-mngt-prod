import * as z from "zod";

export const issueUpdateSchema = z.object({
	status: z.enum(["reported", "resolved", "in_progress"]),
});

export type TIssueUpdateSchema = z.infer<typeof issueUpdateSchema>;
