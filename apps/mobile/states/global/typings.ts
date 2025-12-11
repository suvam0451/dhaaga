import { PostPublisherService } from '#/services/publishers/post.publisher';
import { AppPublisherService } from '#/services/publishers/app.publisher';
import { Profile } from '@dhaaga/db';
import {
	AppStateUserSessionActions,
	AppStateUserSessionState,
} from '#/states/global/slices/createUserSessionSlice';
import {
	AppStateHubSessionActions,
	AppStateHubSessionState,
} from '#/states/global/slices/createHubSessionSlice';
import { WritableDraft } from 'immer';
import {
	AppStateAppThemingActions,
	AppStateAppThemingState,
} from '#/states/global/slices/createAppThemingSlice';
import {
	AppStateBottomSheetActions,
	AppStateBottomSheetState,
} from '#/states/global/slices/createBottomSheetSlice';
import {
	AppStateAppDialogActions,
	AppStateAppDialogState,
} from '#/states/global/slices/createAppDialogSlice';
import { APP_KNOWN_MODAL } from './store';
import {
	AppStateAppSessionActions,
	AppStateAppSessionState,
} from '#/states/global/slices/createAppSessionSlice';

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

export type AppPubSubState = {
	postObjectActions: PostPublisherService;
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

export type AppGlobalState = {
	// sessions
	appSession: AppStateAppSessionState & AppStateAppSessionActions;
	userSession: AppStateUserSessionState & AppStateUserSessionActions;
	hubSession: AppStateHubSessionState & AppStateHubSessionActions;

	// special modals
	[APP_KNOWN_MODAL.IMAGE_INSPECT]: AppModalStateBase;
	[APP_KNOWN_MODAL.USER_PEEK]: AppModalStateBase;

	// ui state
	bottomSheet: AppStateBottomSheetState & AppStateBottomSheetActions;
	dialog: AppStateAppDialogState & AppStateAppDialogActions;

	appTheme: AppStateAppThemingState & AppStateAppThemingActions;
};

export type AppStateImmerSetObject = {
	(
		nextStateOrUpdater:
			| AppGlobalState
			| Partial<AppGlobalState>
			| ((state: WritableDraft<AppGlobalState>) => void),
		shouldReplace?: false,
	): void;
	(
		nextStateOrUpdater:
			| AppGlobalState
			| ((state: WritableDraft<AppGlobalState>) => void),
		shouldReplace: true,
	): void;
};

export type AppStateImmerGetObject = () => AppGlobalState;
