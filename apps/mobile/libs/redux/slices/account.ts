import {PayloadAction, createSlice} from "@reduxjs/toolkit";

export type AccountCreateDTO = {
  domain: string;
  subdomain: string;
  username: string;
  password?: string;
  last_login_at?: Date;
  verified?: boolean;
};

export type AccountDTO = AccountCreateDTO & {
  id: string;
  // credentials?: CredentialDTO[];
};


export interface AccountState {
  activeAccount: AccountDTO
}

export const initialState: AccountState = {
  activeAccount: null,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<AccountDTO>) => {
      state.activeAccount = action.payload;
    },
  },
});
