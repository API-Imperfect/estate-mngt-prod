import * as z from "zod";

const usernameRegex = /^[a-zA-Z0-9_@+.-]+$/;

export const registerUserSchema = z
	.object({
		username: z.string().regex(usernameRegex, {
			message:
				"Usernames can only contain letters(uppercase and lowercase), digits, _, @, +, ., and -",
		}),
		first_name: z
			.string()
			.trim()
			.min(2, { message: "First name must be at least 2 characters long" })
			.max(50, { message: "First name must be less than 50 characters long" }),
		last_name: z
			.string()
			.trim()
			.min(2, { message: "Last name must be at least 2 characters long" })
			.max(50, { message: "Last name must be less than 50 characters long" }),
		email: z.string().trim().email({ message: "Enter a valid email address" }),
		password: z
			.string()
			.min(8, { message: "Password must be at least 8 characters long" }),
		re_password: z.string().min(8, {
			message: "Confirm Password must be at least 8 characters long",
		}),
	})
	.refine((data) => data.password === data.re_password, {
		message: "Passwords do not match",
		path: ["re_password"],
	});

export type TRregisterUserSchema = z.infer<typeof registerUserSchema>;
