import * as z from "zod";

export const apartmentCreateSchema = z.object({
	unit_number: z.string().trim().min(1, "An Apartment unit number is required"),
	building: z.string().trim().min(1, "A building name is required"),
	floor: z
		.number()
		.nonnegative({ message: "The building floor can't be negative" })
		.max(5, { message: "The Floor in the building can't be more than 5" }),
});

export type TApartmentCreateSchema = z.infer<typeof apartmentCreateSchema>;
