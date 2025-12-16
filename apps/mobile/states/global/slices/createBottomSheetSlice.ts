import {
	DriverUserFindQueryType,
	FeedObjectType,
	type PostLinkAttachmentObjectType,
	RandomUtil,
} from '@dhaaga/bridge';
import {
	AppStateImmerGetObject,
	AppStateImmerSetObject,
} from '#/states/global/typings';
import { PostTimelineStateType } from '@dhaaga/core';

/**
 * App crashes on moving to a different file...
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
	USER_PREVIEW = 'ProfilePeek',
	REACTION_DETAILS = 'ReactionDetails',
	SELECT_ACCOUNT = 'SelectAccount',
	STATUS_COMPOSER = 'StatusComposer',
	STATUS_MENU = 'StatusMenu',
	STATUS_PREVIEW = 'StatusPreview',
	SWITCH_THEME_PACK = 'SwitchThemePack',
	FEED_SETTINGS = 'TimeLineController',
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

type AppStateBottomSheetContextType =
	| { $type: 'post-id'; postId: string }
	| { $type: 'profile-id'; profileId: number; callback: () => void }
	| { $type: 'event-bus-post-object'; postId: string }
	| { $type: 'post-preview'; postId: string }
	| { $type: 'compose-reply'; parentPostId: string }
	| { $type: 'compose-quote'; quotedPostId: string }
	| {
			$type: 'tag-preview';
			tagId: string;
	  }
	| ({
			$type: 'user-preview';
	  } & DriverUserFindQueryType)
	| {
			$type: 'mentioned-user-preview';
			mentionString: string;
	  }
	| ({ $type: 'set-feed-options' } & PostTimelineStateType)
	| {
			$type: 'link-preview';
			linkAttachment: PostLinkAttachmentObjectType;
	  }
	| {
			$type: 'atproto-feed-options';
			feedUri: string;
	  };

export type AppStateBottomSheetState = {
	type: APP_BOTTOM_SHEET_ENUM;
	visible: boolean;
	/**
	 * An internal id that resets the state
	 * of the bottom sheet. Use reset()
	 * to force a reset.
	 */
	stateId: string;
	/**
	 * The starting value of the passed
	 * context and the final value of the
	 * transformed object for the same.
	 *
	 * If a change was detected, the callback
	 * function may want to update the UI
	 * based on these parameters
	 *
	 * e.g. - When the user updates the filters
	 * for a timeline from the 2nd tab of the app
	 */
	startHash: string;
	endHash: string;
	hasChanges: boolean;

	initialContext: AppStateBottomSheetContextType | null;
	/**
	 * context passed to the bottom sheet.
	 *
	 * when a callback function is provided,
	 * the (potentially transformed) context
	 * is passed back, along-with the boolean
	 * value of hasChanges
	 */
	context: AppStateBottomSheetContextType | null;
	callback: (
		context: AppStateBottomSheetContextType,
		hasChanged: boolean,
	) => void | null;
};

export type AppStateBottomSheetActions = {
	setContext: (ctx: AppStateBottomSheetContextType) => void;
	reset: () => void;
	show: (
		type?: APP_BOTTOM_SHEET_ENUM,
		reset?: boolean,
		context?: AppStateBottomSheetContextType,
		callback?: (
			context: AppStateBottomSheetContextType,
			hasChanges: boolean,
		) => void,
	) => void;
	hide: () => void;
	/**
	 * apply changes (if any) by passing the context
	 * draft using the callback function (if any)
	 */
	apply: () => void;
};

function createBottomSheetSlice(
	set: AppStateImmerSetObject,
	get: AppStateImmerGetObject,
): AppStateBottomSheetState & AppStateBottomSheetActions {
	return {
		/**
		 * ---- STATE ----
		 */

		type: APP_BOTTOM_SHEET_ENUM.NA,
		visible: false,
		stateId: RandomUtil.nanoId(),
		startHash: RandomUtil.nanoId(),
		endHash: RandomUtil.nanoId(),
		hasChanges: false,
		context: null,
		callback: null,
		initialContext: null,

		// timeline: {
		// 	draftState: null,
		// 	dispatch: null,
		// 	manager: null,
		// 	attach: (
		// 		_state: PostTimelineStateType,
		// 		_dispatch: PostTimelineDispatchType,
		// 	) => {
		// 		set((state) => {
		// 			state.bottomSheet.timeline.draftState = _state;
		// 			state.bottomSheet.timeline.dispatch = _dispatch;
		// 		});
		// 	},
		// },

		/**
		 * ---- ACTIONS ----
		 */

		setContext: function (context: AppStateBottomSheetContextType) {
			set((state) => {
				state.bottomSheet.context = context;
			});
		},
		reset: function (): void {
			set((state) => {
				state.bottomSheet.stateId = RandomUtil.nanoId();
			});
		},
		show: (type, reset, context, callback) => {
			set((state) => {
				if (type) state.bottomSheet.type = type;
				if (reset) state.bottomSheet.stateId = RandomUtil.nanoId();
				state.bottomSheet.initialContext = context ?? null;
				state.bottomSheet.context = context ?? null;
				state.bottomSheet.callback = callback ?? null;
				state.bottomSheet.visible = true;
			});
		},
		hide: () => {
			set((state) => {
				state.bottomSheet.visible = false;
			});
		},
		apply: () => {
			const callbackCopy = get().bottomSheet.callback;
			const contextCopy = get().bottomSheet.context;
			const hasChanges =
				get().bottomSheet.startHash !== get().bottomSheet.endHash;

			if (callbackCopy) callbackCopy(contextCopy, hasChanges);

			/**
			 * Clear function reference for GC
			 */
			set((state) => {
				state.bottomSheet.visible = false;
				state.bottomSheet.callback = null;
				state.bottomSheet.context = null;
				state.bottomSheet.initialContext = null;
			});
		},
	};
}

export default createBottomSheetSlice;
