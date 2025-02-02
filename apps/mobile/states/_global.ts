import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ThemePackType } from '../assets/loaders/UseAppThemePackLoader';
import { APP_BUILT_IN_THEMES } from '../styles/BuiltinThemes';
import { Account, Profile } from '../database/_schema';
import {
	ActivityPubClient,
	ActivityPubClientFactory,
	KNOWN_SOFTWARE,
} from '@dhaaga/bridge';
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
import { AppUserObject } from '../types/app-user.types';
import ProfileSessionManager from '../services/session/profile-session.service';
import { ProfileService } from '../database/entities/profile';
import AppSessionManager from '../services/session/app-session.service';
import { AppColorSchemeType } from '../utils/theming.util';
import AccountSessionManager from '../services/session/account-session.service';
import { WritableDraft } from 'immer';
import { TimelineSessionService } from '../services/session/timeline-session.service';
import { PostPublisherService } from '../services/publishers/post.publisher';
import { AppPublisherService } from '../services/publishers/app.publisher';
import { UserMiddleware } from '../services/middlewares/user.middleware';
import {
	AppTimelineReducerDispatchType,
	AppTimelineReducerStateType,
} from './interactors/post-timeline.reducer';

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
	TEXT_INPUT = 'TextInput',
}

/**
 * List of known modals
 */
export enum APP_KNOWN_MODAL {
	IMAGE_INSPECT = 'imageInspectModal',
	USER_PEEK = 'userPeekModal',
}

export type AppDialogInstanceState = {
	title: string;
	description: string[];
	actions: {
		label: string;
		onPress: () => Promise<void>;
		variant?:
			| 'default'
			| 'switch'
			| 'important'
			| 'dismiss'
			| 'warning'
			| 'destructive';
		selected?: boolean;
	}[];
};

type AppDialogState = {
	type: APP_DIALOG_SHEET_ENUM;
	stateId: string;
	refresh: () => void;
	visible: boolean;
	state: AppDialogInstanceState | null;
	show: (
		data: AppDialogInstanceState,
		textSeed?: string,
		callback?: (text: string) => void,
	) => void;
	hide: () => void;
	textSeed: string;
	textSubmitCallback: (text: string) => void;
};

type AppPubSubState = {
	postPub: PostPublisherService;
	userPub: PostPublisherService;
	appSub: AppPublisherService;
};

type AppHubState = {
	profiles: Profile[];
	pageIndex: number;
	refresh: () => void;
	loadNext: () => void;
	loadPrev: () => void;
	selectProfile: (index: number) => void;
};

/**
 * App crashes on moving to different file...
 */
export enum APP_BOTTOM_SHEET_ENUM {
	APP_PROFILE = 'AppProfile',
	ADD_PROFILE = 'AddProfile',
	HASHTAG = 'Hashtag',
	LINK = 'Link',
	MORE_POST_ACTIONS = 'MorePostActions',
	MORE_USER_ACTIONS = 'MoreUserActions',
	NA = 'N/A',
	PROFILE_PEEK = 'ProfilePeek',
	REACTION_DETAILS = 'ReactionDetails',
	SELECT_ACCOUNT = 'SelectAccount',
	STATUS_COMPOSER = 'StatusComposer',
	STATUS_MENU = 'StatusMenu',
	STATUS_PREVIEW = 'StatusPreview',
	SWITCH_THEME_PACK = 'SwitchThemePack',
	TIMELINE_CONTROLLER = 'TimeLineController',
	ADD_BOOKMARK = 'AddBookmark',
	ADD_HUB_TAG = 'AddHubTag',
	ADD_HUB_USER = 'AddHubUser',
	ADD_HUB_FEED = 'AddHubFeed',

	POST_SHOW_REPLIES = 'PostShowReplies',
	POST_SHOW_LIKES = 'PostShowLikes',
	POST_SHOW_SHARES = 'PostShowShares',

	POST_PREVIEW = 'PostPreview',
	ADD_REACTION = 'AddReaction',
}

type AppBottomSheetState = {
	type: APP_BOTTOM_SHEET_ENUM;

	stateId: string; // a way to notify sheet closing event
	endSessionSeed: string;

	refresh: () => void;
	setType: (type: APP_BOTTOM_SHEET_ENUM) => void;
	visible: boolean /**
	 * present the modal
	 * @param type set the type of modal to show
	 * @param refresh also perform a refresh
	 */;
	show: (type?: APP_BOTTOM_SHEET_ENUM, refresh?: boolean) => void;
	hide: () => void;

	ctx: any;
	setCtx: (ctx: any) => void;

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
			manager: TimelineSessionService,
		) => void;
		manager: TimelineSessionService;
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

	publishers: AppPubSubState;

	/**
	 * fetched account credentials
	 * converted into application
	 * compatible interface
	 * */
	driver: KNOWN_SOFTWARE;
	me: AppUserObject | null;

	// router used to make api requests
	router: ActivityPubClient | null;

	packId: string;
	colorScheme: AppColorSchemeType;
	setColorScheme: (themeKey: string) => void;
	packList: AppThemePack[];
	activePack: ThemePackType;

	// sheets
	bottomSheet: AppBottomSheetState;
	hubState: AppHubState;

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
	appInitialize: (db: SQLiteDatabase) => void;
	loadApp: () => Promise<void>; // loa/switch a profile
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
				let session = AtprotoSessionService.create(db, acct);

				// re-login login
				if (session.checkTokenExpiry()) {
					await AtprotoSessionService.reLogin(db, acct);
					session = AtprotoSessionService.create(db, acct);
				}

				await session.resume(db);
				const { success, data, reason } = await session.saveSession();
				if (!success)
					console.log('[INFO]: session restore status', success, reason);
				payload = {
					...data,
					subdomain: acct.server,
					pdsUrl: session.pdsUrl,
				};
			}
			const _router = ActivityPubClientFactory.get(acct.driver as any, payload);
			const { data } = await _router.me.getMe();
			const obj: AppUserObject = UserMiddleware.deserialize(
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
				state.publishers.appSub = new AppPublisherService();
			});
		},
		getPacks: () => [],
		setPack: (packId: string) => {
			set({ packId });
		},
		selectAccount: async (selection: Account) => {
			AccountService.select(get().db, selection);
		},
		publishers: {
			postPub: null,
			userPub: null,
			appSub: null,
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
					state.profileSessionManager = new ProfileSessionManager(get().db);
					state.router = restoreResult.value.router;
					state.driver = restoreResult.value.acct.driver as KNOWN_SOFTWARE;
					state.publishers.postPub = new PostPublisherService(
						restoreResult.value.acct.driver as KNOWN_SOFTWARE,
						restoreResult.value.router,
					);
				} else {
					state.acct = null;
					state.router = null;
					state.driver = KNOWN_SOFTWARE.UNKNOWN;
				}
			});
		},
		hubState: {
			profiles: [],
			pageIndex: -1,
			refresh: () => {
				if (!get().acct) return;
				const profiles = ProfileService.getForAccount(get().db, get().acct);
				if (profiles.length === 0) return;
				set((state) => {
					state.hubState.profiles = ProfileService.getForAccount(
						get().db,
						get().acct,
					);
					state.hubState.pageIndex = 0;
				});
			},
			loadNext: () => {
				// return state
			},
			loadPrev: () => {
				// return state
			},
			selectProfile: (index: number) => {
				set((state) => {
					state.hubState.pageIndex = index;
				});
			},
		},
		bottomSheet: {
			type: APP_BOTTOM_SHEET_ENUM.NA,
			visible: false,
			stateId: RandomUtil.nanoId(),
			endSessionSeed: RandomUtil.nanoId(),
			ctx: null,
			setCtx: function (ctx: { uuid: string }) {
				set((state) => {
					state.bottomSheet.ctx = ctx;
				});
			},
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
				manager: null,
				attach: (
					_state: AppTimelineReducerStateType,
					_dispatch: AppTimelineReducerDispatchType,
					manager: TimelineSessionService,
				) => {
					set((state) => {
						state.bottomSheet.timeline.draftState = _state;
						state.bottomSheet.timeline.dispatch = _dispatch;
						state.bottomSheet.timeline.manager = manager;
					});
				},
			},
		},
		dialog: {
			type: APP_DIALOG_SHEET_ENUM.DEFAULT,
			stateId: RandomUtil.nanoId(),
			visible: false,
			textSeed: null,
			textSubmitCallback: undefined,
			show: (
				data: AppDialogInstanceState,
				textSeed?: string,
				callback?: (text: string) => void,
			) => {
				set((state) => {
					state.dialog.state = data;
					state.dialog.stateId = RandomUtil.nanoId();
					if (textSeed !== undefined && textSeed !== null && callback) {
						state.dialog.type = APP_DIALOG_SHEET_ENUM.TEXT_INPUT;
						state.dialog.textSeed = textSeed;
						state.dialog.textSubmitCallback = callback;
					} else {
						state.dialog.textSeed = null;
						state.dialog.textSubmitCallback = undefined;
					}
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
