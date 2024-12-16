import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { MMKV } from 'react-native-mmkv';
import {
	DEFAULT_THEME_PACK_OBJECT,
	ThemePackType,
} from '../assets/loaders/UseAppThemePackLoader';
import {
	APP_BUILT_IN_THEMES,
	AppColorSchemeType,
} from '../styles/BuiltinThemes';
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
import { RandomUtil } from '../utils/random.utils';
import { ActivityPubStatusAppDtoType } from '../services/approto/app-status-dto.service';
import { TimelineDataReducerFunction } from '../components/common/timeline/api/postArrayReducer';
import { DataSource } from '../database/dataSource';
import { AppMmkvInstance } from '../database/_cache';

type AppThemePack = {
	id: string;
	name: string;
};

export enum REACT_NATIVE_BOTTOM_SHEET_ENUM {
	POST_MENU = 'PostMenu',
	NA = 'N/A',
}

export enum APP_BOTTOM_SHEET_ENUM {
	APP_PROFILE = 'AppProfile',
	HASHTAG = 'Hashtag',
	LINK = 'Link',
	MORE_POST_ACTIONS = 'MorePostActions',
	NA = 'N/A',
	PROFILE_PEEK = 'ProfilePeek',
	REACTION_DETAILS = 'ReactionDetails',
	SELECT_ACCOUNT = 'SelectAccount',
	STATUS_COMPOSER = 'StatusComposer',
	STATUS_MENU = 'StatusMenu',
	STATUS_PREVIEW = 'StatusPreview',
	SWITCH_THEME_PACK = 'SwitchThemePack',
	TIMELINE_CONTROLLER = 'TimeLineController',
}

export enum APP_DIALOG_SHEET_ENUM {
	DEFAULT = 'Default',
}

type AppDialogInstanceState = {
	title: string;
	description: string[];
	actions: {
		label: string;
		onPress: () => void;
	}[];
};

type AppDialogState = {
	type: APP_DIALOG_SHEET_ENUM;
	stateId: string;
	refresh: () => void;
	visible: boolean;
	state: AppDialogInstanceState | null;
	showDefault: (data: AppDialogInstanceState) => void;
	hide: () => void;
};

type AppBottomSheetState = {
	type: APP_BOTTOM_SHEET_ENUM;
	stateId: string;
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

	/**
	 * to prevent lists from being
	 * rendered while the bottom
	 * sheet animation is playing out
	 * */
	isAnimating: boolean;

	// references
	HandleRef: string;
	ParentRef: ActivityPubStatusAppDtoType;
	RootRef: ActivityPubStatusAppDtoType;
	textValue: string;
	setTextValue(textValue: string): void;
	postValue: ActivityPubStatusAppDtoType;
	setPostValue: (obj: ActivityPubStatusAppDtoType) => void;

	PostIdRef: string;
	UserRef: UserInterface;
	UserIdRef: string; // pre-populate the post-composer to this content
	PostComposerTextSeedRef: string;

	// reducers
	timelineDataPostListReducer: TimelineDataReducerFunction;
	setTimelineDataPostListReducer: (obj: TimelineDataReducerFunction) => void;
};

type State = {
	db: DataSource | null;
	mmkv: AppMmkvInstance; // currently active account
	acct: Account | null /**
	 * fetched account credentials
	 * converted into application
	 * compatible interface
	 * */;
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
	setColorScheme: (themeKey: string) => void;
	packList: AppThemePack[];
	activePack: ThemePackType;

	bottomSheet: AppBottomSheetState;
	dialog: AppDialogState;
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
	// database drivers
	db: null,
	mmkv: null,
	router: null,

	// account data
	driver: null,
	acct: null,
	me: null,

	homepageType: TimelineFetchMode.IDLE,

	// theme packs
	packId: 'default',
	packList: [],
	getPacks: () => [],
	setPack: () => {},
	colorScheme: null,
	setColorScheme: undefined,

	appInitialize: undefined,
	restoreSession: undefined,
	selectAccount: undefined,
	setHomepageType: undefined,
	activePack: DEFAULT_THEME_PACK_OBJECT,
	bottomSheet: {
		type: APP_BOTTOM_SHEET_ENUM.NA,
		visible: false,
		stateId: RandomUtil.nanoId(),
		refresh: undefined,
		setType: undefined,
		show: undefined,
		hide: undefined,
		isAnimating: false,
		HandleRef: undefined,
		ParentRef: undefined,
		RootRef: undefined,
		textValue: undefined,
		postValue: undefined,
		setPostValue: undefined,
		PostIdRef: undefined,
		UserRef: undefined,
		UserIdRef: undefined,
		PostComposerTextSeedRef: undefined,
		timelineDataPostListReducer: undefined,
		setTimelineDataPostListReducer: undefined,
		setTextValue: undefined,
	},
	dialog: undefined,
};

class GlobalStateService {
	static async restoreAppSession(db: DataSource): Promise<
		Result<{
			acct: Account;
			router: ActivityPubClient;
		}>
	> {
		try {
			const acct = AccountService.getSelected(db);
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
			// EmojiService.refresh(db, globalDb, acct.server, true);
			return { type: 'success', value: { acct, router: _router } };
		} catch (e) {
			console.log(e);
			console.log('[ERROR]: failed to restore previous app session');
		}
	}
}

const useGlobalState = create<State & Actions>()(
	immer((set, get) => ({
		...defaultValue,
		theme: APP_BUILT_IN_THEMES[0],
		appInitialize: (db: SQLiteDatabase) => {
			set((state) => {
				state.db = new DataSource(db);
				state.mmkv = new AppMmkvInstance(new MMKV({ id: `default` }));
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
			set((state) => {
				state.homepageType = selection;
			});
		},
		bottomSheet: {
			type: APP_BOTTOM_SHEET_ENUM.NA,
			visible: false,
			stateId: RandomUtil.nanoId(),
			refresh: function (): void {
				throw new Error('Function not implemented.');
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
			isAnimating: false,
			HandleRef: undefined,
			ParentRef: undefined,
			RootRef: undefined,
			textValue: undefined,
			setTextValue: (value: string) => {
				set((state) => {
					state.bottomSheet.textValue = value;
				});
			},
			postValue: null,
			setPostValue: (obj: ActivityPubStatusAppDtoType) => {
				set((state) => {
					state.bottomSheet.postValue = obj;
				});
			},
			PostIdRef: undefined,
			UserRef: undefined,
			UserIdRef: undefined,
			PostComposerTextSeedRef: undefined,
			timelineDataPostListReducer: null,
			setTimelineDataPostListReducer: (obj: TimelineDataReducerFunction) => {
				set((state) => {
					state.bottomSheet.timelineDataPostListReducer = obj;
				});
			},
		},
		dialog: {
			type: APP_DIALOG_SHEET_ENUM.DEFAULT,
			stateId: RandomUtil.nanoId(),
			visible: false,
			showDefault: (data: AppDialogInstanceState) => {
				set((state) => {
					state.dialog.state = data;
					state.dialog.stateId = RandomUtil.nanoId();
					state.dialog.type = APP_DIALOG_SHEET_ENUM.DEFAULT;
					state.dialog.visible = true;
				});
			},
			state: null,
			hide: () => {
				set((state) => {
					state.dialog.visible = true;
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
