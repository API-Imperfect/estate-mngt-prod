import * as z from "zod";

export const profileSchema = z.object({
	gender: z.enum(["male", "female", "other"]),
	occupation: z.enum([
		"mason",
		"carpenter",
		"plumber",
		"roofer",
		"painter",
		"electrician",
		"hvac",
		"tenant",
	]),
	country_of_origin: z.string().min(1, "Country of origin is required"),
	city_of_origin: z.string().min(1, "City of origin is required"),
	bio: z.string().optional(),
	first_name: z.string().min(1, "First name is required"),
	last_name: z.string().min(1, "Last name is required"),
	username: z.string().min(1, "Username is required"),
	phone_number: z.string().trim(),
});

export type TProfileSchema = z.infer<typeof profileSchema>;
