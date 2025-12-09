import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { APP_BUILT_IN_THEMES } from '../styles/BuiltinThemes';
import { KNOWN_SOFTWARE, RandomUtil } from '@dhaaga/bridge';
import { SQLiteDatabase } from 'expo-sqlite';
import {
	Account,
	AccountService,
	DataSource,
	ProfileService,
} from '@dhaaga/db';
import ProfileSessionManager from '../services/session/profile-session.service';
import AppSessionManager from '../services/session/app-session.service';
import AccountSessionManager from '../services/session/account-session.service';
import { PostPublisherService } from '../services/publishers/post.publisher';
import { AppPublisherService } from '../services/publishers/app.publisher';
import { PostTimelineDispatchType, PostTimelineStateType } from '@dhaaga/core';
import {
	AppDialogInstanceState,
	AppGlobalActions,
	AppGlobalState,
} from '#/states/_global.types';
import { AppSessionService } from '#/services/app-session.service';
import { ModalStateBlockGenerator } from '#/states/_global.utils';

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
	MORE_FEED_ACTIONS = 'MoreFeedActions',
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

const useGlobalState = create<AppGlobalState & AppGlobalActions>()(
	immer((set, get) => ({
		session: {
			state: 'idle',
			target: null,
			me: null,
			logs: [],
		},
		db: null,
		acct: null,
		profile: null,
		profileSessionManager: null,
		appSession: null,
		acctManager: null,
		driver: KNOWN_SOFTWARE.UNKNOWN,
		router: null,
		me: null,
		imageInspectModal: ModalStateBlockGenerator(
			set,
			APP_KNOWN_MODAL.IMAGE_INSPECT,
		),
		userPeekModal: ModalStateBlockGenerator(set, APP_KNOWN_MODAL.USER_PEEK),
		appInitialize: (db: SQLiteDatabase) => {
			set((state) => {
				const _db = new DataSource(db);
				state.db = _db;
				state.appSession = new AppSessionManager(_db);
				state.publishers.appSub = new AppPublisherService();
			});
		},
		selectAccount: async (selection: Account) => {
			AccountService.select(get().db!, selection);
		},
		publishers: {
			postObjectActions: null,
			userPub: null,
			appSub: null,
		},
		loadActiveProfile: async () => {
			// load default profile/account
			const x = new ProfileSessionManager(get().db!);
			if (!x.acct || !x.profile) return;

			set((state) => {
				// reset reactive pointers
				state.acct = x.acct;
				state.profile = x.profile;
				// reset session managers
				state.profileSessionManager = x;
				state.acctManager = new AccountSessionManager(get().db!, x.acct);
			});
		},
		loadApp: async () => {
			const _db = get().db;
			if (!_db) return;

			set((state) => {
				state.session = {
					state: 'loading',
					target: null,
					me: null,
					logs: [],
				};
			});

			/**
			 * The same "idle" state needs to be set, regardless
			 * of
			 */
			let acct = null;
			let reason = null;
			try {
				acct = AccountService.getSelected(_db);
			} catch (e) {
				reason = e.message;
			}

			if (!acct) {
				set((state) => {
					state.session = {
						state: 'idle',
						target: null,
						me: null,
						logs: [],
					};
					state.me = null;
					state.acct = null;
					state.acctManager = null;
					state.profileSessionManager = null;
					state.router = null;
					state.driver = KNOWN_SOFTWARE.UNKNOWN;
					state.publishers.postObjectActions = null;
				});
				return;
			}

			try {
				const { acct, router, me } =
					await AppSessionService.restoreAppSession(_db);

				set((state) => {
					state.session = {
						state: 'valid',
						target: acct,
						me: me,
						logs: [],
					};
					state.me = me;
					state.acct = acct;
					state.acctManager = new AccountSessionManager(_db, acct);
					state.profileSessionManager = new ProfileSessionManager(_db);
					state.router = router;
					state.driver = acct.driver as KNOWN_SOFTWARE;
					state.publishers.postObjectActions = new PostPublisherService(router);
				});
			} catch (e) {
				set((state) => {
					state.session = {
						state: 'invalid',
						target: acct,
						me: null,
						logs: [],
						error: `[ERROR]: failed to restore app session. ${e.message}`,
					};
					state.acct = null;
					state.router = null;
					state.driver = KNOWN_SOFTWARE.UNKNOWN;
				});
			}
		},
		hubState: {
			profiles: [],
			pageIndex: -1,
			refresh: () => {
				const _acct = get().acct;
				const _db = get().db;
				if (!_acct || !_db) return;

				const profiles = ProfileService.getForAccount(_db, _acct);
				if (profiles.length === 0) return;
				set((state) => {
					state.hubState.profiles = ProfileService.getForAccount(_db, _acct);
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

			animating: false,
			startAnimation: () => {
				set((state) => {
					state.bottomSheet.animating = true;
				});
			},
			endAnimation: () => {
				set((state) => {
					state.bottomSheet.animating = false;
				});
			},
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
					_state: PostTimelineStateType,
					_dispatch: PostTimelineDispatchType,
				) => {
					set((state) => {
						state.bottomSheet.timeline.draftState = _state;
						state.bottomSheet.timeline.dispatch = _dispatch;
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
