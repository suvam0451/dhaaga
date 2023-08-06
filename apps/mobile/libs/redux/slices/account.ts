// export interface

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AccountDTO } from "../../sqlite/repositories/accounts.repo";
import { CredentialDTO } from "../../sqlite/repositories/credentials.repo";

export interface AccountState {
	activeAccount: AccountDTO | null;
  credentials: CredentialDTO[];
}

export const initialState: AccountState = {
	activeAccount: null,
  credentials: [],
};

export const accountSlice = createSlice({
	name: "account",
	initialState,
	reducers: {
		setAccount: (state, action: PayloadAction<AccountDTO>) => {
			state.activeAccount = action.payload;
		},
    setCredentials: (state, action: PayloadAction<CredentialDTO[]>) => {
      state.credentials = action.payload;
    }
	},
});
