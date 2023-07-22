import { PayloadAction, createReducer, createSlice } from "@reduxjs/toolkit";

export interface ProviderAuthItem {
	id: number;
	domain: string;
	subdomain: string;
	username: string;
	password: string;
	credentials?: Record<string, string>;
	verified: boolean;
}

export interface ProviderAuthState {
	// search parameters
	selectedDomain: string;
	selectedSubDomain: string;

	// selection
	selectedAccount: ProviderAuthItem | null;

	loggedIn: boolean;
	accounts: ProviderAuthItem[];
	loggedInAs: ProviderAuthItem | null;
	loggedInCredentials: Record<string, string>;
}

export const initialState: ProviderAuthState = {
	selectedDomain: "",
	selectedSubDomain: "",
	loggedIn: false,
	accounts: [],
	loggedInAs: null,
	loggedInCredentials: {},
	selectedAccount: null,
};

/**
 * State manager for account switching
 */
export const providerAuthSlice = createSlice({
	name: "providerAuth",
	initialState,
	reducers: {
		setSelectedAccount: (state, action: PayloadAction<ProviderAuthItem>) => {
			return {
				...state,
				selectedAccount: action.payload,
			};
		},
		login: (state, action: PayloadAction<ProviderAuthItem>) => {
			return {
				...state,
				loggedIn: true,
				loggedInAs: action.payload,
			};
		},
		logout: (state) => {
			return {
				...state,
				loggedIn: false,
				loggedInAs: null,
			};
		},
		updateCredentials: (state, action: PayloadAction<ProviderAuthItem[]>) => {
			return {
				...state,
				accounts: action.payload,
			};
		},
		setSelectedDomain: (state, action: PayloadAction<string>) => {
			return {
				...state,
				selectedDomain: action.payload,
			};
		},
		setAccounts: (state, action: PayloadAction<ProviderAuthItem[]>) => {
			if (!action.payload) return state;
			return {
				...state,
				accounts: action.payload,
			};
		},
		setSelectedSubdomain: (state, action: PayloadAction<string>) => {
			return {
				...state,
				selectedSubDomain: action.payload,
			};
		},
		clearSearchSelection: (state) => {
			return {
				...state,
				selectedDomain: "",
				selectedSubDomain: "",
			};
		},
	},
});
