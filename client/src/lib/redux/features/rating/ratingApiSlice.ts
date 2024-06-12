import { RatingData, RatingResponse } from "@/types";
import { baseApiSlice } from "../api/baseApiSlice";

export const ratingApiSlice = baseApiSlice.injectEndpoints({
	endpoints: (builder) => ({
		addRating: builder.mutation<RatingResponse, RatingData>({
			query: (ratingData) => ({
				url: "/ratings/create/",
				method: "POST",
				body: ratingData,
			}),
			invalidatesTags: ["Post"],
		}),
	}),
});

export const { useAddRatingMutation } = ratingApiSlice;
