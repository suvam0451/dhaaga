import { createAction, createReducer } from "@reduxjs/toolkit";

export interface SearchState {
	lastExecutedSearchTerm: string | null;
	searchTerm: string;
}

const setSearchTerm = createAction<string, "setSearchTerm">("setSearchTerm");
const clearSearchTerm = createAction("clearSearchTerm");

export const searchSlice = createReducer<SearchState>(
	{ lastExecutedSearchTerm: null, searchTerm: "" },
	(builder) =>
		builder
			.addCase(setSearchTerm, (state, action) => {
				return {
					...state,
					searchTerm: action.payload,
				};
			})
			.addCase(clearSearchTerm, (state, action) => {
				return {
					...state,
					searchTerm: "",
				};
			})
);
