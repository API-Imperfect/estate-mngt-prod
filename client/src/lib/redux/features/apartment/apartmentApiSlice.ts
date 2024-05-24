import { ApartmentData, ApartmentResponse } from "@/types";
import { baseApiSlice } from "../api/baseApiSlice";

export const apartmentApiSlice = baseApiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createApartment: builder.mutation<ApartmentResponse, ApartmentData>({
			query: (formData) => ({
				url: "/apartments/add/",
				method: "POST",
				body: formData,
			}),
			invalidatesTags: ["Apartment"],
		}),

		getMyApartment: builder.query<ApartmentResponse, void>({
			query: () => "/apartments/my-apartment/",
			providesTags: ["Apartment"],
		}),
	}),
});

export const { useCreateApartmentMutation, useGetMyApartmentQuery } =
	apartmentApiSlice;
