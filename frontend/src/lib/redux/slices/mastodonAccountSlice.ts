import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ProviderAuthItem } from "./authSlice";

export interface MastodonAccountState {
	accessToken?: string;
	avatar?: string;
	displayName?: string;
	loggedInAs: ProviderAuthItem | null;
}

export const initialState: MastodonAccountState = {
	loggedInAs: null,
};

export const mastodonAccountSlice = createSlice({
	name: "mastodonAccount",
	initialState,
	reducers: {
		setAccessToken: (state, action: PayloadAction<string>) => {
			state.accessToken = action.payload;
		},
	},
});
