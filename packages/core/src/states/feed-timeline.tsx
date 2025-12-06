import { DataSource } from '@dhaaga/db';
import {
	timelineReducerBaseDefaults,
	type TimelineReducerBaseState,
} from './_timeline.shared.js';
import { produce } from 'immer';
import { RandomUtil, type ResultPage } from '@dhaaga/bridge';
import type { FeedObjectType } from '@dhaaga/bridge/typings';
import {
	createContext,
	type Dispatch,
	type ReactNode,
	useContext,
	useReducer,
} from 'react';

type State = TimelineReducerBaseState<FeedObjectType> & {};
type PageType = ResultPage<FeedObjectType>;

export const DEFAULT: State = {
	...timelineReducerBaseDefaults,
	items: [],
};

export enum ACTION {
	INIT,
	RESET,
	APPEND_RESULTS,
	REQUEST_LOAD_MORE,
	SET_QUERY_OPTS,
}

type Actions =
	| {
			type: ACTION.INIT;
			payload: {
				db: DataSource;
			};
	  }
	| {
			type: ACTION.RESET;
	  }
	| {
			type: ACTION.REQUEST_LOAD_MORE;
	  }
	| {
			type: ACTION.APPEND_RESULTS;
			payload: PageType;
	  }
	| {
			type: ACTION.SET_QUERY_OPTS;
			payload: { limit: number; q?: string };
	  };

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case ACTION.INIT: {
			return produce(state, (draft) => {
				draft.db = action.payload.db;
				draft.seen = new Set();
				draft.sessionId = RandomUtil.nanoId();
			});
		}
		case ACTION.RESET: {
			return produce(state, (draft) => {
				draft.items = [];
				draft.maxId = null;
				draft.minId = null;
				draft.isEol = false;
				draft.isFirstLoad = false;
				draft.seen = new Set();
			});
		}
		case ACTION.REQUEST_LOAD_MORE: {
			return produce(state, (draft) => {
				draft.appliedMaxId = state.maxId;
			});
		}
		case ACTION.APPEND_RESULTS: {
			const copy = Array.from(state.items);
			for (const item of action.payload.items) {
				if (state.seen.has(item.uri)) continue;
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
		default:
			return state;
	}
}

type DispatchType = Dispatch<Actions>;

// contexts
const StateCtx = createContext<State | null>(null);
const DispatchCtx = createContext<DispatchType | null>(null);
// hooks
const useFeedTimelineState = () => useContext(StateCtx);
const useFeedTimelineDispatch = () => useContext(DispatchCtx);
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
	Ctx as FeedTimelineCtx,
	useFeedTimelineState,
	useFeedTimelineDispatch,
	ACTION as FeedTimelineStateAction,
};
export type {
	State as FeedTimelineStateType,
	DispatchType as FeedTimelineDispatchType,
};
