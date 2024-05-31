import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
	page: 1,
};

const postSlice = createSlice({
	name: "post",
	initialState,
	reducers: {
		setCurrentPage: (state, action: PayloadAction<number>) => {
			state.page = action.payload;
		},
	},
});

export const { setCurrentPage } = postSlice.actions;
export default postSlice.reducer;
