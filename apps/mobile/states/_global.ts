import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { MMKV } from 'react-native-mmkv';
import {
	DEFAULT_THEME_PACK_OBJECT,
	ThemePackType,
} from '../assets/loaders/UseAppThemePackLoader';
import { AppColorSchemeType } from '../styles/BuiltinThemes';
import { Account } from '../database/_schema';
import {
	ActivityPubClientFactory,
	KNOWN_SOFTWARE,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { AccountService } from '../database/entities/account';
import { SQLiteDatabase } from 'expo-sqlite';
import { ActivityPubClient } from '@dhaaga/shared-abstraction-activitypub';
import AtprotoSessionService from '../services/atproto/atproto-session.service';
import { AccountMetadataService } from '../database/entities/account-metadata';
import { TimelineFetchMode } from '../components/common/timeline/utils/timeline.types';
import { Result } from '../utils/result';

type AppThemePack = {
	id: string;
	name: string;
};

type State = {
	db: SQLiteDatabase | null;
	mmkv: MMKV | null; // currently active account
	acct: Account | null;
	/**
	 * fetched account credentials
	 * converted into application
	 * compatible interface
	 * */
	driver: KNOWN_SOFTWARE;
	me: UserInterface | null;

	// router used to make api requests
	router: ActivityPubClient | null;

	// Screens

	/**
	 * what is displayed on the homepage
	 *
	 * NOTE: reset when different
	 * account selected
	 * */
	homepageType: TimelineFetchMode;

	packId: string;
	colorScheme: AppColorSchemeType;
	packList: AppThemePack[];
	activePack: ThemePackType;
};

type Actions = {
	selectAccount(acct: Account): void;
	getPacks: () => AppThemePack[];
	setPack: (packId: string) => void;

	setHomepageType: (selection: TimelineFetchMode) => void;
	appInitialize: (db: SQLiteDatabase) => void;
	restoreSession: () => void;
};

const defaultValue: State & Actions = {
	db: null,
	mmkv: null,
	router: null,
	driver: null,
	acct: null,
	me: null,
	homepageType: TimelineFetchMode.IDLE,
	packId: 'default',
	packList: [],
	colorScheme: undefined,
	getPacks: () => [],
	setPack: () => {},
	appInitialize: undefined,
	restoreSession: undefined,
	selectAccount: undefined,
	setHomepageType: undefined,
	activePack: DEFAULT_THEME_PACK_OBJECT,
};

class GlobalStateService {
	static async restoreAppSession(db: SQLiteDatabase): Promise<
		Result<{
			acct: Account;
			router: ActivityPubClient;
		}>
	> {
		try {
			const acct = await AccountService.getSelected(db);
			if (!acct) {
				return { type: 'invalid' };
			}
			const token = AccountMetadataService.getKeyValueForAccountSync(
				db,
				acct,
				'access_token',
			);
			let payload: any = {
				instance: acct?.server,
				token,
			};

			// Bluesky is built different
			if (acct.driver === KNOWN_SOFTWARE.BLUESKY) {
				const session = AtprotoSessionService.create(db, acct);
				await session.resume();
				const { success, data, reason } = await session.saveSession();
				if (!success)
					console.log('[INFO]: session restore status', success, reason);
				payload = {
					...data,
					subdomain: acct.server,
				};
			}
			const _router = ActivityPubClientFactory.get(acct.driver as any, payload);
			return { type: 'success', value: { acct, router: _router } };
		} catch (e) {
			console.log('[ERROR]: failed to restore previous app session');
		}
	}
}

const useGlobalState = create<State & Actions>()(
	immer((set, get) => ({
		...defaultValue,
		appInitialize: (db: SQLiteDatabase) => {
			set((state) => {
				state.db = db;
				state.mmkv = new MMKV({ id: `default` });
			});
		},
		getPacks: () => [],
		setPack: (packId: string) => {
			set({ packId });
		},
		selectAccount: async (selection: Account) => {
			await AccountService.select(get().db, selection);
		},
		restoreSession: async () => {
			const restoreResult = await GlobalStateService.restoreAppSession(
				get().db,
			);
			set((state) => {
				if (restoreResult.type === 'success') {
					state.acct = restoreResult.value.acct;
					state.router = restoreResult.value.router;
					state.driver = restoreResult.value.acct.driver as KNOWN_SOFTWARE;
				} else {
					state.acct = null;
					state.router = null;
					state.driver = KNOWN_SOFTWARE.UNKNOWN;
				}
				state.homepageType = TimelineFetchMode.IDLE;
			});
		},
		setHomepageType: (selection: TimelineFetchMode) => {
			set((state) => ({
				...state,
				homepageType: selection,
			}));
		},
	})),
);

export default useGlobalState;
