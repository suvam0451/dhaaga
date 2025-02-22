import { produce } from 'immer';
import {
	createContext,
	type Dispatch,
	type ReactNode,
	useContext,
	useReducer,
} from 'react';
import type { NotificationObjectType } from '../parsers/notification';
import type { ResultPage } from '../types/core.types';

type State = {
	seen: Set<string>;
	items: NotificationObjectType[];
};

const DEFAULT: State = {
	seen: new Set(),
	items: [],
};

enum ACTION {
	APPEND,
	REPLACE,
	RESET,
}

type Actions =
	| {
			type: ACTION.APPEND;
			payload: { page: ResultPage<NotificationObjectType> };
	  }
	| {
			type: ACTION.REPLACE;
			payload: { page: ResultPage<NotificationObjectType> };
	  }
	| {
			type: ACTION.RESET;
	  };

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case ACTION.RESET: {
			return produce(state, (draft) => {
				draft.seen = new Set();
				draft.items = [];
			});
		}
		case ACTION.APPEND: {
			return produce(state, (draft) => {
				for (const item of action.payload.page.items) {
					if (draft.seen.has(item.id)) continue;
					draft.seen.add(item.id);
					draft.items.push(item);
				}
			});
		}
		case ACTION.REPLACE: {
			return produce(state, (draft) => {
				draft.seen = new Set();
				draft.items = [];
				for (const item of action.payload.page.items) {
					if (draft.seen.has(item.id)) continue;
					draft.seen.add(item.id);
					draft.items.push(item);
				}
			});
		}
	}
}

type DispatchType = Dispatch<Actions>;

// contexts
const StateCtx = createContext<State | null>(null);
const DispatchCtx = createContext<DispatchType | null>(null);
// hooks
const useInboxState = () => useContext(StateCtx);
const useInboxDispatch = () => useContext(DispatchCtx);
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
	Ctx as InboxCtx,
	useInboxState,
	useInboxDispatch,
	ACTION as InboxStateAction,
};
export type { State as InboxStateType, DispatchType as InboxDispatchType };
