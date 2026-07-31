import { RootStateImmerGetObject, RootStateImmerSetObject } from '../typings';

export type AuthToken = {
	accessToken: string;
	refreshToken?: string;
	expiresAt?: number;
	user?: {
		id: string;
		displayName: string;
		avatarUrl: string;
		handle: string;
	};
	server: string;
};

export type AuthState = {
	tokens: Record<string, AuthToken>; // key is server:username
	activeAccountId: string | null;
	status: 'idle' | 'loading' | 'success' | 'error';
	error: string | null;
	tempAuthData: {
		instanceUrl: string;
		clientId: string;
		clientSecret: string;
		loginUrl: string;
	} | null;
};

export type AuthActions = {
	setToken: (accountId: string, token: AuthToken) => void;
	removeToken: (accountId: string) => void;
	setActiveAccount: (accountId: string | null) => void;
	clearAuth: () => void;
	setAuthStatus: (status: AuthState['status'], error?: string | null) => void;
	setTempAuthData: (data: AuthState['tempAuthData']) => void;
};

const DEFAULT_STATE: AuthState = {
	tokens: {},
	activeAccountId: null,
	status: 'idle',
	error: null,
	tempAuthData: null,
};

function createAuthSlice(
	set: RootStateImmerSetObject,
	_get: RootStateImmerGetObject,
): AuthState & AuthActions {
	return {
		...DEFAULT_STATE,

		setToken: (accountId: string, token: AuthToken) => {
			set((state) => {
				state.auth.tokens[accountId] = token;
				state.auth.status = 'success';
			});
		},

		removeToken: (accountId: string) => {
			set((state) => {
				delete state.auth.tokens[accountId];
				if (state.auth.activeAccountId === accountId) {
					state.auth.activeAccountId = null;
				}
			});
		},

		setActiveAccount: (accountId: string | null) => {
			set((state) => {
				state.auth.activeAccountId = accountId;
			});
		},

		clearAuth: () => {
			set((state) => {
				state.auth.tokens = {};
				state.auth.activeAccountId = null;
				state.auth.tempAuthData = null;
				state.auth.status = 'idle';
				state.auth.error = null;
			});
		},

		setAuthStatus: (status, error = null) => {
			set((state) => {
				state.auth.status = status;
				state.auth.error = error;
			});
		},

		setTempAuthData: (data) => {
			set((state) => {
				state.auth.tempAuthData = data;
			});
		},
	};
}

export default createAuthSlice;
