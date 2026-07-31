import { WritableDraft } from 'immer';
import { AuthState, AuthActions } from './slices/createAuthSlice';

export type RootState = {
	auth: AuthState & AuthActions;
};

export type RootStateImmerSetObject = {
	(
		nextStateOrUpdater:
			| RootState
			| Partial<RootState>
			| ((state: WritableDraft<RootState>) => void),
		shouldReplace?: false,
	): void;
	(
		nextStateOrUpdater: RootState | ((state: WritableDraft<RootState>) => void),
		shouldReplace: true,
	): void;
};

export type RootStateImmerGetObject = () => RootState;
