import { DataSource } from '@dhaaga/db';
import { RandomUtil, type ResultPage } from '@dhaaga/bridge';
import type { UserObjectType } from '@dhaaga/bridge/typings';
import { produce } from 'immer';
import {
	createContext,
	type Dispatch,
	type ReactNode,
	useContext,
	useReducer,
} from 'react';
import {
	timelineReducerBaseDefaults,
	type TimelineReducerBaseState,
} from './_timeline.shared.js';

type State = TimelineReducerBaseState<UserObjectType> & {};

const DEFAULT: State = {
	...timelineReducerBaseDefaults,
	items: [],
};

enum ACTION {
	INIT,
	RESET,
	APPEND,
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
			type: ACTION.APPEND;
			payload: ResultPage<UserObjectType>;
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
				draft.isFirstLoad = false;
				draft.seen = new Set();
			});
		}
		case ACTION.APPEND: {
			const copy = Array.from(state.items);

			return produce(state, (draft) => {
				for (const item of action.payload.items) {
					if (draft.seen.has(item.id)) continue;
					draft.seen.add(item.id);
					copy.push(item);
				}

				draft.items = copy;
				draft.maxId = action.payload.maxId;
			});
		}
		case ACTION.SET_QUERY_OPTS: {
			return produce(state, (draft) => {
				draft.opts = action.payload;
			});
		}
	}
}

type DispatchType = Dispatch<Actions>;

// contexts
const StateCtx = createContext<State | null>(null);
const DispatchCtx = createContext<DispatchType | null>(null);
// hooks
const useUserTimelineState = () => useContext(StateCtx);
const useUserTimelineDispatch = () => useContext(DispatchCtx);
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
	Ctx as UserTimelineCtx,
	useUserTimelineState,
	useUserTimelineDispatch,
	ACTION as UserTimelineStateAction,
};
export type {
	State as UserTimelineStateType,
	DispatchType as UserTimelineDispatchType,
};
