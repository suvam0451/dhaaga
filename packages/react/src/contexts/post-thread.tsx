import {
	createContext,
	Dispatch,
	ReactNode,
	useContext,
	useReducer,
} from 'react';
import {
	ApiTargetInterface,
	type DhaagaPostThreadInterfaceType,
	type PostObjectType,
	postThreadInterfaceToObjectChain,
} from '@dhaaga/bridge';
import { produce } from 'immer';

type State = {
	lookup: Map<string, PostObjectType>;
	children: Map<string, string[]>;
	history: PostObjectType[];
	anchor: PostObjectType | null;
};

const DEFAULT = {
	lookup: new Map(),
	children: new Map(),
	history: [],
	anchor: null,
};

enum ACTION {
	RESET = 'init',
	SETUP = 'setup',
}

type Actions =
	| {
			type: ACTION.RESET;
	  }
	| {
			type: ACTION.SETUP;
			payload: {
				anchor: PostObjectType;
				client: ApiTargetInterface;
				chainData: DhaagaPostThreadInterfaceType;
			};
	  };

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case ACTION.RESET: {
			return produce(state, (draft) => {
				draft.anchor = null;
				draft.history = [];
				draft.lookup.clear();
				draft.children.clear();
			});
		}
		case ACTION.SETUP: {
			const chainData = action.payload.chainData;
			const anchor = action.payload.anchor;
			const client = action.payload.client;

			// TODO: some runtime validation should go here

			const { history, itemLookup, childrenLookup } =
				postThreadInterfaceToObjectChain(chainData, client, anchor);

			return produce(state, (draft) => {
				draft.anchor = anchor;
				draft.history = history;
				draft.lookup = itemLookup;
				draft.children = childrenLookup;
			});
		}
	}
}

type DispatchType = Dispatch<Actions>;

// contexts
const StateCtx = createContext<State | null>(null);
const DispatchCtx = createContext<DispatchType | null>(null);
// hooks
const usePostThreadState = () => useContext(StateCtx);
const usePostThreadDispatch = () => useContext(DispatchCtx);
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
	Ctx as PostThreadCtx,
	usePostThreadState,
	usePostThreadDispatch,
	ACTION as PostThreadAction,
};

export type {
	State as PostThreadStateType,
	DispatchType as PostThreadDispatchType,
};
