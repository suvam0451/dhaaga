import { AppUserObject } from '../../types/app-user.types';
import { AppPostObject } from '../../types/app-post.types';
import { produce } from 'immer';
import { Dispatch } from 'react';
import { SEARCH_RESULT_TAB } from '../../services/driver.service';

export enum APP_SEARCH_TYPE {
	POSTS,
	USERS,
	LINKS,
	HASHTAGS,
	HOME,
}

export type DiscoverTabSearchResultType = {
	users: AppUserObject[];
	posts: AppPostObject[];
	tags: any[];
	links: string[];
};

type State = {
	text: string | null;
	q: string | null;
	category: APP_SEARCH_TYPE;
	tab: SEARCH_RESULT_TAB;
	results: DiscoverTabSearchResultType;
};

export const defaultAppSearchResults = {
	users: [],
	posts: [],
	tags: [],
	links: [],
};

enum ACTION {
	SET_SEARCH,
	CLEAR_SEARCH, // category
	APPLY_SEARCH,
	SET_CATEGORY,
	SET_CATEGORY_POSTS,
	SET_CATEGORY_USERS,
	SET_CATEGORY_TAGS,
	SET_CATEGORY_LINKS, // search results
	SET_SEARCH_RESULTS,
}

const DEFAULT: State = {
	text: null,
	q: null,
	tab: SEARCH_RESULT_TAB.HOME,
	category: APP_SEARCH_TYPE.USERS,
	results: defaultAppSearchResults,
};

type Actions =
	| {
			type: ACTION.SET_SEARCH;
			payload: {
				q: string;
			};
	  }
	| {
			type: ACTION.CLEAR_SEARCH;
	  }
	| { type: ACTION.APPLY_SEARCH }
	| {
			type: ACTION.SET_CATEGORY;
			payload: {
				tab: SEARCH_RESULT_TAB;
			};
	  }
	| {
			type: ACTION.SET_CATEGORY_POSTS;
	  }
	| {
			type: ACTION.SET_CATEGORY_USERS;
	  }
	| {
			type: ACTION.SET_CATEGORY_TAGS;
	  }
	| {
			type: ACTION.SET_CATEGORY_LINKS;
	  }
	| {
			type: ACTION.SET_SEARCH_RESULTS;
			payload: DiscoverTabSearchResultType;
	  };

/**
 *
 * @param tab
 * @param q
 */
function convertTabToResultPageType(tab: SEARCH_RESULT_TAB, q: any) {
	if (!q) return APP_SEARCH_TYPE.HOME;

	switch (tab) {
		case SEARCH_RESULT_TAB.HOME: {
			return APP_SEARCH_TYPE.HOME;
		}
		case SEARCH_RESULT_TAB.PEOPLE: {
			return APP_SEARCH_TYPE.USERS;
		}
		case SEARCH_RESULT_TAB.TOP:
		case SEARCH_RESULT_TAB.LATEST:
		case SEARCH_RESULT_TAB.POSTS: {
			return APP_SEARCH_TYPE.POSTS;
		}
		case SEARCH_RESULT_TAB.TAGS: {
			return APP_SEARCH_TYPE.HASHTAGS;
		}
		default: {
			return APP_SEARCH_TYPE.HOME;
		}
	}
}

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case ACTION.SET_SEARCH: {
			return produce(state, (draft) => {
				draft.text = action.payload.q === '' ? null : action.payload.q;
			});
		}
		case ACTION.CLEAR_SEARCH: {
			return produce(state, (draft) => {
				draft.text = null;
				draft.q = null;
				draft.tab = SEARCH_RESULT_TAB.HOME;
			});
		}
		case ACTION.APPLY_SEARCH: {
			return produce(state, (draft) => {
				draft.q = draft.text;
			});
		}
		case ACTION.SET_CATEGORY: {
			return produce(state, (draft) => {
				draft.tab = action.payload.tab;
				draft.category = convertTabToResultPageType(
					action.payload.tab,
					state.q,
				);
			});
		}
		case ACTION.SET_CATEGORY_USERS: {
			return produce(state, (draft) => {
				draft.category = APP_SEARCH_TYPE.USERS;
			});
		}
		case ACTION.SET_CATEGORY_POSTS: {
			return produce(state, (draft) => {
				draft.category = APP_SEARCH_TYPE.POSTS;
			});
		}
		case ACTION.SET_CATEGORY_TAGS: {
			return produce(state, (draft) => {
				draft.category = APP_SEARCH_TYPE.HASHTAGS;
			});
		}
		case ACTION.SET_CATEGORY_LINKS: {
			return produce(state, (draft) => {
				draft.category = APP_SEARCH_TYPE.LINKS;
			});
		}
	}
}

type DiscoverTabDispatchType = Dispatch<Actions>;
export {
	reducer as discoverTabReducer,
	DEFAULT as discoverTabReducerDefault,
	ACTION as DiscoverTabReducerActionType,
	Actions as discoverTabReducerActions,
	State as DiscoverTabReducerStateType,
	DiscoverTabDispatchType,
};
