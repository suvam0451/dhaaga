import type { PostObjectType, UserObjectType } from '@dhaaga/bridge/typings';
import { produce } from 'immer';
import {
	createContext,
	type Dispatch,
	type ReactNode,
	useContext,
	useReducer,
} from 'react';

const searchTabs = [
	'top',
	'latest',
	'feeds',
	'posts',
	'users',
	'tags',
	'links',
	'news',
	'home',
] as const;
type SearchTabType = (typeof searchTabs)[number];

const searchResultTypes = ['posts', 'users', 'links', 'tags', 'feeds'] as const;
type SearchResultType = (typeof searchResultTypes)[number];

export type DiscoverTabSearchResultType = {
	users: UserObjectType[];
	posts: PostObjectType[];
	tags: any[];
	links: string[];
};

type State = {
	text: string | null;
	q: string | null;
	category: SearchResultType | null;
	tab: SearchTabType;
	results: DiscoverTabSearchResultType; //to indicate loading status for the user
	searchStatus: 'idle' | 'loading';
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
	MARK_LOADING_DONE,
}

const DEFAULT: State = {
	text: null,
	q: null,
	tab: 'home',
	category: null,
	results: defaultAppSearchResults,
	searchStatus: 'idle',
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
				tab: SearchTabType;
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
	  }
	| {
			type: ACTION.MARK_LOADING_DONE;
	  };

/**
 *
 * @param tab
 * @param q
 */
function convertTabToResultPageType(
	tab: SearchTabType,
	q: any,
): SearchResultType | null {
	if (!q) return null;

	switch (tab) {
		case 'users':
			return 'users';
		case 'top':
		case 'latest':
		case 'posts':
			return 'posts';
		case 'tags':
			return 'tags';
		case 'feeds':
			return 'feeds';
		default:
			return null;
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
				draft.tab = 'home';
			});
		}
		case ACTION.APPLY_SEARCH: {
			return produce(state, (draft) => {
				draft.q = draft.text;
				draft.category = convertTabToResultPageType(draft.tab, draft.text);
				draft.searchStatus = 'loading';
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
				draft.category = 'users';
			});
		}
		case ACTION.SET_CATEGORY_POSTS: {
			return produce(state, (draft) => {
				draft.category = 'posts';
			});
		}
		case ACTION.SET_CATEGORY_TAGS: {
			return produce(state, (draft) => {
				draft.category = 'tags';
			});
		}
		case ACTION.SET_CATEGORY_LINKS: {
			return produce(state, (draft) => {
				draft.category = 'links';
			});
		}
		case ACTION.MARK_LOADING_DONE: {
			return produce(state, (draft) => {
				draft.searchStatus = 'idle';
			});
		}
		default:
			return state;
	}
}

type DispatchType = Dispatch<Actions>;

// contexts
const StateCtx = createContext<State>(DEFAULT);
const DispatchCtx = createContext<DispatchType | null>(null);
// hooks
const useDiscoverState = () => useContext(StateCtx);
const useDiscoverDispatch = () => useContext(DispatchCtx);
// wrapper
function Ctx({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(reducer, DEFAULT);
	return (
		<StateCtx.Provider value={state}>
			<DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
		</StateCtx.Provider>
	);
}

export {
	Ctx as DiscoverCtx,
	useDiscoverState,
	useDiscoverDispatch,
	ACTION as DiscoverStateAction,
};
export type {
	State as DiscoverStateType,
	DispatchType as DiscoverDispatchType,
	SearchTabType,
};
