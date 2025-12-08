import {
	APP_BOTTOM_SHEET_ENUM,
	APP_DIALOG_SHEET_ENUM,
	APP_KNOWN_MODAL,
} from '#/states/_global';
import { PostTimelineDispatchType, PostTimelineStateType } from '@dhaaga/core';
import { PostPublisherService } from '#/services/publishers/post.publisher';
import { AppPublisherService } from '#/services/publishers/app.publisher';
import { Account, DataSource, Profile } from '@dhaaga/db';
import ProfileSessionManager from '#/services/session/profile-session.service';
import AppSessionManager from '#/services/session/app-session.service';
import AccountSessionManager from '#/services/session/account-session.service';
import { ApiTargetInterface, KNOWN_SOFTWARE } from '@dhaaga/bridge';
import type { UserObjectType } from '@dhaaga/bridge';
import { AppColorSchemeType } from '#/utils/theming.util';
import { SQLiteDatabase } from 'expo-sqlite';

export type AppModalStateBase = {
	stateId: string;
	visible: boolean;
	show: (refresh?: boolean) => void;
	hide: () => void;
	refresh: () => void;
};

export type AppDialogButtonAction = {
	// label that appears on the button
	label: string;
	// action to perform on press
	onPress: () => Promise<void>;
	// variant of the button (impacts theming)
	variant?:
		| 'default'
		| 'switch'
		| 'important'
		| 'dismiss'
		| 'warning'
		| 'destructive';
	selected?: boolean;
};

export type AppDialogInstanceState = {
	title: string;
	description: string[];
	actions: AppDialogButtonAction[];
};
export type AppDialogState = {
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
	textSeed: string | null;
	textSubmitCallback?: (text: string) => void;
};

export type AppBottomSheetState = {
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

	/**
	 * Animation
	 */
	animating: boolean;
	startAnimation: () => void;
	endAnimation: () => void;

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
		draftState: PostTimelineStateType | null;
		dispatch: PostTimelineDispatchType | null;
		attach: (
			state: PostTimelineStateType,
			dispatch: PostTimelineDispatchType,
		) => void;
	};
};

export type AppPubSubState = {
	postPub: PostPublisherService;
	userPub: PostPublisherService;
	appSub: AppPublisherService;
};

export type AppHubState = {
	profiles: Profile[];
	pageIndex: number;
	refresh: () => void;
	loadNext: () => void;
	loadPrev: () => void;
	selectProfile: (index: number) => void;
};

type AppSessionIndicatorObject = {
	state: 'idle' | 'loading' | 'valid' | 'invalid';
	target: Account | null;
	me: UserObjectType | null;
	error?: string;
	logs: string[];
};

export type AppGlobalState = {
	/**
	 * stats about the currently active session
	 */
	session: AppSessionIndicatorObject;
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
	me: UserObjectType | null;

	// router used to make api requests
	router: ApiTargetInterface | null;

	// packId: string;
	colorScheme: AppColorSchemeType;
	setColorScheme: (themeKey: string) => void;
	// packList: AppThemePack[];
	// activePack: ThemePackType;

	// sheets
	bottomSheet: AppBottomSheetState;
	hubState: AppHubState;

	// modals
	[APP_KNOWN_MODAL.IMAGE_INSPECT]: AppModalStateBase;
	[APP_KNOWN_MODAL.USER_PEEK]: AppModalStateBase;

	// dialogs (also a modal)
	dialog: AppDialogState;
};

export type AppGlobalActions = {
	selectAccount(acct: Account): void;
	// getPacks: () => AppThemePack[];
	// setPack: (packId: string) => void;
	appInitialize: (db: SQLiteDatabase) => void;
	loadApp: () => Promise<void>; // loa/switch a profile
	loadActiveProfile: (profile?: Profile) => void;
};
