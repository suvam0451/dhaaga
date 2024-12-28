import { DhaagaJsTimelineQueryOptions } from '@dhaaga/shared-abstraction-activitypub';
import { AppPostObject } from '../../types/app-post.types';
import { RandomUtil } from '../../utils/random.utils';
import { produce } from 'immer';
import { DataSource } from '../../database/dataSource';
import { ProfilePinnedTimelineService } from '../../database/entities/profile-pinned-timeline';
import { APP_PINNED_OBJECT_TYPE } from '../../services/driver.service';
import { ProfilePinnedUserService } from '../../database/entities/profile-pinned-user';
import { ProfilePinnedTagService } from '../../database/entities/profile-pinned-tag';
import { Dispatch } from 'react';
import { ActivityPubReactionStateDto } from '../../services/approto/activitypub-reactions.service';

type AppTimelineQueryOptions = DhaagaJsTimelineQueryOptions;

export enum TimelineFetchMode {
	IDLE = 'Idle',

	HOME = 'Home',
	LOCAL = 'Local',
	FEDERATED = 'Federated',
	SOCIAL = 'Social',
	BUBBLE = 'Bubble',

	HASHTAG = 'Hashtag',
	USER = 'User',
	LIST = 'List',
	ANTENNA = 'Antenna',

	REMOTE_TIMELINE = 'Remote Timeline',

	ADD_NEW = 'Add New',
}

type State = {
	db: DataSource | null;
	sessionIdentifier: string;
	feedType: TimelineFetchMode;

	opts: AppTimelineQueryOptions; // for users/hashtags
	query: { id: string; label: string } | null;
	isWidgetVisible: boolean;
	isEol: boolean;
	items: AppPostObject[];
	seen: Set<string>;

	// pagination state
	isFirstLoadPending: boolean;
	minId: string | null;
	maxId: string | null;

	/**
	 * Updating this value will result in
	 * fetching the next set of data
	 */
	appliedMaxId: string | null;
};

export const DEFAULT: State = {
	db: null,
	sessionIdentifier: RandomUtil.nanoId(),
	feedType: TimelineFetchMode.IDLE,
	isEol: false,
	opts: { limit: 20 },
	query: null,
	isWidgetVisible: false,
	items: [],
	seen: new Set<string>(),

	// pagination state
	isFirstLoadPending: true,
	minId: null,
	maxId: null,
	appliedMaxId: null,
};

export enum ACTION {
	INIT,
	RESET_USING_QUERY,
	RESET_USING_PIN_ID, // also handles empty timeline state (first loading)
	APPEND_RESULTS,
	SET_QUERY_PARAMS,
	SET_QUERY_OPTS,
	REQUEST_LOAD_MORE,
	RESET,
	SHOW_WIDGET,
	HIDE_WIDGET,

	// Post Action Callbacks
	UPDATE_BOOKMARK_STATUS,
	UPDATE_BOOST_STATUS,
	UPDATE_TRANSLATION_OUTPUT,
	UPDATE_LIKE_STATUS,
	UPDATE_REACTION_STATE,
	POST_OBJECT_CHANGED,
}

type Actions =
	| {
			type: ACTION.INIT;
			payload: {
				db: DataSource;
			};
	  }
	| {
			type: ACTION.RESET_USING_QUERY;
			payload: {
				type: TimelineFetchMode;
			};
	  }
	| {
			type: ACTION.RESET_USING_PIN_ID;
			payload: {
				id: number;
				type: 'feed' | 'user' | 'tag';
			};
	  }
	| {
			type: ACTION.APPEND_RESULTS;
			payload: {
				items: AppPostObject[];
				minId?: string;
				maxId?: string;
			};
	  }
	| {
			type: ACTION.SET_QUERY_PARAMS;
			payload: AppTimelineQueryOptions;
	  }
	| {
			type: ACTION.REQUEST_LOAD_MORE;
	  }
	| {
			type: ACTION.RESET;
	  }
	| {
			type: ACTION.SHOW_WIDGET;
	  }
	| {
			type: ACTION.HIDE_WIDGET;
	  }
	| {
			type: ACTION.SET_QUERY_OPTS;
			payload: AppTimelineQueryOptions;
	  }
	/**
	 * Post Action Callbacks
	 */
	| {
			type: ACTION.UPDATE_BOOKMARK_STATUS;
			payload: {
				id: string;
				value: boolean;
			};
	  }
	| {
			type: ACTION.UPDATE_BOOST_STATUS;
			payload: {
				id: string;
				delta: number; // delta = -1, 1, 0
			};
	  }
	| {
			type: ACTION.UPDATE_TRANSLATION_OUTPUT;
			payload: {
				id: string;
				outputText: string;
				outputType: string;
			};
	  }
	| {
			type: ACTION.UPDATE_LIKE_STATUS;
			payload: {
				id: string;
				delta: number; // delta = -1, 1, 0
			};
	  }
	| {
			type: ACTION.UPDATE_REACTION_STATE;
			payload: {
				id: string;
				state: any;
			};
	  }
	| {
			type: ACTION.POST_OBJECT_CHANGED;
			payload: {
				item: AppPostObject;
			};
	  };

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case ACTION.INIT: {
			return produce(state, (draft) => {
				draft.db = action.payload.db;
				draft.seen = new Set();
			});
		}
		case ACTION.RESET_USING_QUERY: {
			return produce(state, (draft) => {
				draft.feedType = action.payload.type;
				draft.sessionIdentifier = RandomUtil.nanoId();
				draft.seen = new Set();
			});
		}
		case ACTION.RESET_USING_PIN_ID: {
			const _id = action.payload.id;
			const _type = action.payload.type;
			switch (_type) {
				case 'feed': {
					const match = ProfilePinnedTimelineService.findById(state.db, _id);
					if (!match) return;
					switch (match.category) {
						case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_HOME: {
							return produce(state, (draft) => {
								draft.feedType = TimelineFetchMode.HOME;
								draft.sessionIdentifier = RandomUtil.nanoId();
								draft.seen = new Set();
							});
						}
						case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_LOCAL: {
							return produce(state, (draft) => {
								draft.feedType = TimelineFetchMode.LOCAL;
								draft.sessionIdentifier = RandomUtil.nanoId();
								draft.seen = new Set();
							});
						}
						case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_SOCIAL: {
							return produce(state, (draft) => {
								draft.feedType = TimelineFetchMode.SOCIAL;
								draft.sessionIdentifier = RandomUtil.nanoId();
								draft.seen = new Set();
							});
						}
						case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_BUBBLE: {
							return produce(state, (draft) => {
								draft.feedType = TimelineFetchMode.BUBBLE;
								draft.sessionIdentifier = RandomUtil.nanoId();
								draft.seen = new Set();
							});
						}
						case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_GLOBAL: {
							return produce(state, (draft) => {
								draft.feedType = TimelineFetchMode.FEDERATED;
								draft.sessionIdentifier = RandomUtil.nanoId();
								draft.seen = new Set();
							});
						}
						default: {
							console.log(
								'[WARN]: tried to initialise with an incompatible timeline',
								_id,
								_type,
							);
							return;
						}
					}
				}
				case 'user': {
					const match = ProfilePinnedUserService.findById(state.db, _id);
					if (!match) return;
					switch (match.category) {
						case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_USER_LOCAL:
						case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_USER_REMOTE: {
							return produce(state, (draft) => {
								draft.feedType = TimelineFetchMode.USER;
								draft.sessionIdentifier = RandomUtil.nanoId();
								draft.query = {
									id: match.identifier,
									label: match.displayName || match.username,
								};
								draft.seen = new Set();
							});
						}
						default: {
							console.log(
								'[WARN]: tried to initialise with an incompatible user target',
								_id,
								_type,
							);
							return;
						}
					}
				}

				case 'tag': {
					const match = ProfilePinnedTagService.findById(state.db, _id);
					if (!match) return;
					switch (match.category) {
						case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_TAG_LOCAL:
						case APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_TAG_REMOTE: {
							return produce(state, (draft) => {
								draft.feedType = TimelineFetchMode.HASHTAG;
								draft.seen = new Set();
							});
						}
						default: {
							console.log(
								'[WARN]: tried to initialise with an incompatible tag target',
								_id,
								_type,
							);
							return;
						}
					}
				}
				default: {
					console.log('[WARN]: app does not recognise this query', _id, _type);
					return state;
				}
			}
		}
		case ACTION.APPEND_RESULTS: {
			const copy = Array.from(state.items);
			for (const item of action.payload.items) {
				if (state.seen.has(item.id)) continue;
				copy.push(item);
			}
			return produce(state, (draft) => {
				draft.items = copy;
				draft.maxId = action.payload.maxId;
			});
		}
		case ACTION.SET_QUERY_OPTS: {
			return produce(state, (draft) => {
				draft.opts = action.payload;
			});
		}
		case ACTION.REQUEST_LOAD_MORE: {
			return produce(state, (draft) => {
				draft.appliedMaxId = state.maxId;
			});
		}
		case ACTION.RESET: {
			return produce(state, (draft) => {
				draft.items = [];
				draft.maxId = null;
				draft.minId = null;
				draft.isEol = false;
				draft.isFirstLoadPending = true;
				draft.isWidgetVisible = false;
				draft.seen = new Set();
			});
		}
		case ACTION.SHOW_WIDGET: {
			return produce(state, (draft) => {
				draft.isWidgetVisible = true;
			});
		}
		case ACTION.HIDE_WIDGET: {
			return produce(state, (draft) => {
				draft.isWidgetVisible = true;
			});
		}

		case ACTION.UPDATE_BOOKMARK_STATUS: {
			const _id = action.payload.id;
			const _value = action.payload.value;

			if (_id === undefined || _value === undefined) return state;
			return produce(state, (draft) => {
				for (const post of draft.items) {
					if (post.id === _id) {
						post.interaction.bookmarked = _value;
						post.state.isBookmarkStateFinal = true;
					}

					if (post.boostedFrom?.id === _id) {
						post.boostedFrom.interaction.bookmarked = _value;
						post.boostedFrom.state.isBookmarkStateFinal = true;
					}
				}
			});
		}
		case ACTION.UPDATE_BOOST_STATUS: {
			const _id = action.payload.id;
			const _delta = action.payload.delta;
			if (!_id) return state;
			return produce(state, (draft) => {
				for (const post of draft.items) {
					if (post.id === _id) {
						post.interaction.boosted = _delta != -1;
						post.stats.boostCount += _delta;
					}

					if (post.boostedFrom?.id === _id) {
						post.boostedFrom.interaction.boosted = _delta != -1;
						post.stats.boostCount += _delta;
					}
				}
			});
		}
		case ACTION.UPDATE_TRANSLATION_OUTPUT: {
			const _id = action.payload.id;
			const _outputText = action.payload.outputText;
			const _outputType = action.payload.outputType;
			if (
				_id === undefined ||
				_outputText === undefined ||
				_outputType === undefined
			)
				return state;

			return produce(state, (draft) => {
				for (const post of draft.items) {
					if (post.id === _id) {
						post.calculated.translationOutput = _outputText;
						post.calculated.translationType = _outputType;
					}
					if (post.boostedFrom?.id === _id) {
						post.boostedFrom.calculated.translationOutput = _outputText;
						post.boostedFrom.calculated.translationType = _outputType;
					}
				}
			});
		}
		case ACTION.UPDATE_LIKE_STATUS: {
			const _id = action.payload.id;
			const _delta = action.payload.delta;

			if (_id === undefined || _delta === undefined) return state;
			return produce(state, (draft) => {
				for (const post of draft.items) {
					if (post.id === _id) {
						post.interaction.liked = _delta != -1;
						post.stats.likeCount += _delta;
					}
					if (post.boostedFrom?.id === _id) {
						post.boostedFrom.interaction.liked = _delta != -1;
						post.boostedFrom.stats.likeCount += _delta;
					}
				}
			});
		}
		case ACTION.UPDATE_REACTION_STATE: {
			const _id = action.payload.id;
			const _state = action.payload.state;
			const { data, error } = ActivityPubReactionStateDto.safeParse(_state);
			if (error) {
				console.log('[WARN]: reaction state incorrect', error);
				return state;
			}

			return produce(state, (draft) => {
				for (const post of draft.items) {
					if (post.id === _id) post.stats.reactions = data;
					if (post.boostedFrom?.id === _id)
						post.boostedFrom.stats.reactions = data;
				}
			});
		}

		case ACTION.POST_OBJECT_CHANGED: {
			const newItem = action.payload.item;
			if (!newItem) return state;

			return produce(state, (draft) => {
				draft.items = draft.items.map((post) =>
					post.id === newItem.id ? newItem : post,
				);
			});
		}
	}

	return state;
}

type AppTimelineReducerDispatchType = Dispatch<Actions>;

export {
	State as AppTimelineReducerStateType,
	reducer as appTimelineReducer,
	DEFAULT as appTimelineReducerDefault,
	ACTION as AppTimelineReducerActionType,
	Actions as appTimelineReducerActions,
	AppTimelineReducerDispatchType,
};
