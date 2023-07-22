import { createAction, createReducer } from "@reduxjs/toolkit";
import { getDashboardSearchResults } from "./workerSlice";

type DiscoverSearchResults = {
	items: any[];
	SearchTotal: number;
	total?: number;
};

export interface DiscoverSearchState {
	query: {
		searchTerm: string;
		limit: number;
		offset: number;
		favouritesOnly: boolean;
	};
	searchResults: DiscoverSearchResults;
	numPages: number;
}

const setSearchTerm = createAction<string, "setDashboardSearchTerm">(
	"setDashboardSearchTerm"
);
const setLimit = createAction<number, "setDashboardLimit">("setDashboardLimit");
const setOffset = createAction<number, "setDashboardOffset">(
	"setDashboardOffset"
);
const setFavouritesOnly = createAction<boolean, "setDashboardFavouritesOnly">(
	"setDashboardFavouritesOnly"
);

export const threadsDiscoverReducer = createReducer<DiscoverSearchState>(
	{
		query: {
			searchTerm: "",
			limit: 5,
			offset: 0,
			favouritesOnly: false,
		},
		searchResults: { items: [], SearchTotal: 0 },
		numPages: 0,
	},
	(builder) =>
		builder
			.addCase(setSearchTerm, (state, action) => ({
				...state,
				query: {
					...state.query,
					searchTerm: action.payload,
				},
			}))
			.addCase(setLimit, (state, action) => ({
				...state,
				query: {
					...state.query,
					limit: action.payload,
				},
			}))
			.addCase(setOffset, (state, action) => ({
				...state,
				query: {
					...state.query,
					offset: action.payload,
				},
			}))
			.addCase(setFavouritesOnly, (state, action) => ({
				...state,
				query: {
					...state.query,
					favouritesOnly: action.payload,
				},
			}))
			.addCase(getDashboardSearchResults.fulfilled, (state, action) => {
				let pageCount = 0;
				try {
					pageCount = Math.ceil(action.payload.total / 5);
				} catch (e) {
					console.log(e);
				}
				return {
					...state,
					searchResults: action.payload as any,
					numPages: pageCount,
				};
			})
			.addCase(getDashboardSearchResults.pending, (state, action) => {
				return {
					...state,
				};
			})
			.addCase(getDashboardSearchResults.rejected, (state, action) => {
				return {
					...state,
					searchResults: {
						items: [],
						SearchTotal: 0,
					},
				};
			})
);
