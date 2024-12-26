import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ThemePackType } from '../assets/loaders/UseAppThemePackLoader';
import { APP_BUILT_IN_THEMES } from '../styles/BuiltinThemes';
import { Account, Profile } from '../database/_schema';
import {
	ActivityPubClient,
	ActivityPubClientFactory,
	KNOWN_SOFTWARE,
} from '@dhaaga/shared-abstraction-activitypub';
import { AccountService } from '../database/entities/account';
import { SQLiteDatabase } from 'expo-sqlite';
import AtprotoSessionService from '../services/atproto/atproto-session.service';
import {
	ACCOUNT_METADATA_KEY,
	AccountMetadataService,
} from '../database/entities/account-metadata';
import { Result } from '../utils/result';
import { RandomUtil } from '../utils/random.utils';
import { DataSource } from '../database/dataSource';
import AppUserService from '../services/approto/app-user-service';
import { AppUserObject } from '../types/app-user.types';
import ProfileSessionManager from '../services/session/profile-session.service';
import { ProfileService } from '../database/entities/profile';
import AppSessionManager from '../services/session/app-session.service';
import { AppColorSchemeType } from '../utils/theming.util';
import AccountSessionManager from '../services/session/account-session.service';
import { WritableDraft } from 'immer';
import { APP_BOTTOM_SHEET_ENUM } from '../components/dhaaga-bottom-sheet/Core';
import {
	AppTimelineReducerDispatchType,
	AppTimelineReducerStateType,
	TimelineFetchMode,
} from './reducers/timeline.reducer';

type AppThemePack = {
	id: string;
	name: string;
};

type AppModalStateBase = {
	stateId: string;
	visible: boolean;
	show: (refresh?: boolean) => void;
	hide: () => void;
	refresh: () => void;
};

export enum APP_DIALOG_SHEET_ENUM {
	DEFAULT = 'Default',
}

/**
 * List of known modals
 */
export enum APP_KNOWN_MODAL {
	IMAGE_INSPECT = 'imageInspectModal',
	USER_PEEK = 'userPeekModal',
}

type AppDialogInstanceState = {
	title: string;
	description: string[];
	actions: {
		label: string;
		onPress: () => void;
		variant?: 'default' | 'important' | 'dismiss' | 'warning';
	}[];
};

type AppDialogState = {
	// type: APP_DIALOG_SHEET_ENUM;
	stateId: string;
	refresh: () => void;
	visible: boolean;
	state: AppDialogInstanceState | null;
	show: (data: AppDialogInstanceState) => void;
	hide: () => void;
};

type AppBottomSheetState = {
	type: APP_BOTTOM_SHEET_ENUM;

	stateId: string;
	// a way to notify sheet closing event
	endSessionSeed: string;

	refresh: () => void;
	setType: (type: APP_BOTTOM_SHEET_ENUM) => void;
	visible: boolean;
	/**
	 * present the modal
	 * @param type set the type of modal to show
	 * @param refresh also perform a refresh
	 */
	show: (type?: APP_BOTTOM_SHEET_ENUM, refresh?: boolean) => void;
	hide: () => void;

	broadcastEndSession: () => void;

	/**
	 * to prevent lists from being
	 * rendered while the bottom
	 * sheet animation is playing out
	 * */
	isAnimating: boolean;

	// timeline invoking the sheet
	timeline: {
		draftState: AppTimelineReducerStateType | null;
		dispatch: AppTimelineReducerDispatchType | null;
		attach: (
			state: AppTimelineReducerStateType,
			dispatch: AppTimelineReducerDispatchType,
		) => void;
	};
};

type State = {
	db: DataSource | null;
	acct: Account | null;
	profile: Profile | null;

	// managers
	profileSessionManager: ProfileSessionManager | null;
	appSession: AppSessionManager | null;
	acctManager: AccountSessionManager | null;

	/**
	 * fetched account credentials
	 * converted into application
	 * compatible interface
	 * */
	driver: KNOWN_SOFTWARE;
	me: AppUserObject | null;

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
	setColorScheme: (themeKey: string) => void;
	packList: AppThemePack[];
	activePack: ThemePackType;

	// sheets
	bottomSheet: AppBottomSheetState;

	// modals
	[APP_KNOWN_MODAL.IMAGE_INSPECT]: AppModalStateBase;
	[APP_KNOWN_MODAL.USER_PEEK]: AppModalStateBase;

	// dialogs (also a modal)
	dialog: AppDialogState;
};

function ModalStateBlockGenerator(
	set: (
		nextStateOrUpdater:
			| (State & Actions)
			| Partial<State & Actions>
			| ((state: WritableDraft<State & Actions>) => void),
		shouldReplace?: false,
	) => void,
	modalType: APP_KNOWN_MODAL,
) {
	return {
		stateId: RandomUtil.nanoId(),
		visible: false,
		hide: () => {
			set((state) => {
				state[modalType].visible = false;
			});
		},
		show: (refresh?: boolean) => {
			set((state) => {
				state[modalType].visible = true;
				if (refresh) state[modalType].stateId = RandomUtil.nanoId();
			});
		},
		refresh: () => {
			set((state) => {
				state[modalType].stateId = RandomUtil.nanoId();
			});
		},
	};
}

type Actions = {
	selectAccount(acct: Account): void;
	getPacks: () => AppThemePack[];
	setPack: (packId: string) => void;
	setHomepageType: (selection: TimelineFetchMode) => void;
	appInitialize: (db: SQLiteDatabase) => void;
	loadApp: () => void;
	// loa/switch a profile
	loadActiveProfile: (profile?: Profile) => void;
};

class GlobalStateService {
	static async restoreAppSession(db: DataSource): Promise<
		Result<{
			acct: Account;
			router: ActivityPubClient;
			me: AppUserObject;
		}>
	> {
		try {
			const acct = AccountService.getSelected(db);
			if (!acct) {
				console.log('[WARN]: no account was found');
				return { type: 'invalid' };
			}
			const profile = ProfileService.getActiveProfile(db, acct);
			if (!profile) {
				console.log('[WARN]: no profile was found');
				return { type: 'invalid' };
			}

			const token = AccountMetadataService.getKeyValueForAccountSync(
				db,
				acct,
				ACCOUNT_METADATA_KEY.ACCESS_TOKEN,
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
			const { data } = await _router.me.getMe();
			const obj: AppUserObject = AppUserService.exportRaw(
				data,
				acct.driver,
				acct.server,
			);
			return { type: 'success', value: { acct, router: _router, me: obj } };
		} catch (e) {
			console.log(e);
			console.log('[ERROR]: failed to restore previous app session');
		}
	}
}

const useGlobalState = create<State & Actions>()(
	immer((set, get) => ({
		db: null,
		acct: null,
		profile: null,
		profileSessionManager: null,
		appSession: null,
		acctManager: null,
		driver: KNOWN_SOFTWARE.UNKNOWN,
		router: null,
		me: null,
		activePack: null,
		homepageType: null,
		packId: null,
		imageInspectModal: ModalStateBlockGenerator(
			set,
			APP_KNOWN_MODAL.IMAGE_INSPECT,
		),
		userPeekModal: ModalStateBlockGenerator(set, APP_KNOWN_MODAL.USER_PEEK),
		packList: null,
		theme: APP_BUILT_IN_THEMES[0],
		appInitialize: (db: SQLiteDatabase) => {
			set((state) => {
				const _db = new DataSource(db);
				state.db = _db;
				state.appSession = new AppSessionManager(_db);
			});
		},
		getPacks: () => [],
		setPack: (packId: string) => {
			set({ packId });
		},
		selectAccount: async (selection: Account) => {
			AccountService.select(get().db, selection);
		},
		loadActiveProfile: async () => {
			// load default profile/account
			const x = new ProfileSessionManager(get().db);
			if (!x.acct || !x.profile) return;

			set((state) => {
				// reset reactive pointers
				state.acct = x.acct;
				state.profile = x.profile;
				// reset session managers
				state.profileSessionManager = x;
				state.acctManager = new AccountSessionManager(get().db, x.acct);
			});
		},
		loadApp: async () => {
			const restoreResult = await GlobalStateService.restoreAppSession(
				get().db,
			);
			set((state) => {
				if (restoreResult.type === 'success') {
					state.me = restoreResult.value.me;
					state.acct = restoreResult.value.acct;
					state.acctManager = new AccountSessionManager(
						get().db,
						restoreResult.value.acct,
					);
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
			set((state) => {
				state.homepageType = selection;
			});
		},
		bottomSheet: {
			type: APP_BOTTOM_SHEET_ENUM.NA,
			visible: false,
			stateId: RandomUtil.nanoId(),
			endSessionSeed: RandomUtil.nanoId(),
			refresh: function (): void {
				set((state) => {
					state.bottomSheet.stateId = RandomUtil.nanoId();
				});
			},
			setType: function (type: APP_BOTTOM_SHEET_ENUM): void {
				throw new Error('Function not implemented.');
			},
			show: (type?: APP_BOTTOM_SHEET_ENUM, refresh?: boolean) => {
				set((state) => {
					if (type) state.bottomSheet.type = type;
					if (refresh) state.bottomSheet.stateId = RandomUtil.nanoId();
					state.bottomSheet.visible = true;
				});
			},
			hide: () => {
				set((state) => {
					state.bottomSheet.visible = false;
				});
			},
			broadcastEndSession: () => {
				set((state) => {
					state.bottomSheet.endSessionSeed = RandomUtil.nanoId();
				});
			},
			isAnimating: false,
			timeline: {
				draftState: null,
				dispatch: null,
				attach: (
					_state: AppTimelineReducerStateType,
					_dispatch: AppTimelineReducerDispatchType,
				) => {
					set((state) => {
						state.bottomSheet.timeline.draftState = _state;
						state.bottomSheet.timeline.dispatch = _dispatch;
					});
				},
			},
		},
		dialog: {
			// type: APP_DIALOG_SHEET_ENUM.DEFAULT,
			stateId: RandomUtil.nanoId(),
			visible: false,
			show: (data: AppDialogInstanceState) => {
				set((state) => {
					state.dialog.state = data;
					state.dialog.stateId = RandomUtil.nanoId();
					// state.dialog.type = APP_DIALOG_SHEET_ENUM.DEFAULT;
					state.dialog.visible = true;
				});
			},
			state: null,
			hide: () => {
				set((state) => {
					state.dialog.visible = false;
				});
			},
			refresh: () => {
				set((state) => {
					state.dialog.stateId = RandomUtil.nanoId();
				});
			},
		},
		colorScheme: APP_BUILT_IN_THEMES[0],
		setColorScheme: (key: string) => {
			const match = APP_BUILT_IN_THEMES.find((o) => o.id === key);
			if (match) {
				set((state) => {
					state.colorScheme = match;
				});
			}
		},
	})),
);

export default useGlobalState;
