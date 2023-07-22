import { createAction, createReducer } from "@reduxjs/toolkit";
import { getThreadsRecommendations } from "./workerSlice";
import { threadsapi } from "../../../../wailsjs/go/models";

export interface RecommendationsState {
	searchRecommendations: threadsapi.ThreadsApi_User[];
	recommendationsLoading: boolean;
	searchTerm: string;
	searchErrorStatus: {
		error: boolean;
		message: string;
	};
}

const setSearchTerm = createAction<string, "setSearchTerm">("setSearchTerm");

export const recommendationsSlice = createReducer<RecommendationsState>(
	{
		searchTerm: "",
		searchRecommendations: [],
		recommendationsLoading: false,
		searchErrorStatus: { error: false, message: "" },
	},
	(builder) =>
		builder
			.addCase(setSearchTerm, (state, action) => {
				return {
					...state,
					searchRecommendations: [],
				};
			})
			.addCase(getThreadsRecommendations.fulfilled, (state, action) => {
				return {
					...state,
					searchRecommendations: action.payload,
					recommendationsLoading: false,
				};
			})
			.addCase(getThreadsRecommendations.pending, (state, action) => {
				return {
					...state,
					searchRecommendations: [],
					recommendationsLoading: true,
				};
			})
			.addCase(getThreadsRecommendations.rejected, (state, action) => {
				return {
					...state,
					searchRecommendations: [],
					recommendationsLoading: false,
					searchErrorStatus: {
						error: true,
						message: "",
					},
				};
			})
);
