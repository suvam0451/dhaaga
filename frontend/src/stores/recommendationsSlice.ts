import { createAction, createReducer } from "@reduxjs/toolkit";
import { threadsapi } from "../../wailsjs/go/models";
import { getThreadsRecommendations } from "./workerSlice";

export interface RecommendationsState {
	searchRecommendations: threadsapi.ThreadsApi_User[];
	recommendationsLoading: boolean;
	searchTerm: string;
}

const setSearchTerm = createAction<string, "setSearchTerm">("setSearchTerm");

export const recommendationsSlice = createReducer<RecommendationsState>(
	{ searchTerm: "", searchRecommendations: [], recommendationsLoading: false },
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
);
