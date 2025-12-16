import {
	NotificationObjectType,
	ResultPage,
	UserObjectType,
} from '@dhaaga/bridge';
import { produce } from 'immer';
import {
	createContext,
	Dispatch,
	ReactNode,
	useContext,
	useReducer,
} from 'react';

type State = {
	seen: Set<string>;
	data: NotificationObjectType[];
	users: UserObjectType[];
	items: NotificationObjectType[];
	userSet: Set<string>;
	userSelection: Set<string>;
	allSelected: boolean;
	noneSelected: boolean;
	maxId?: string | null;
	appliedMaxId?: string | null;
	endOfPage: boolean;
};

const DEFAULT: State = {
	seen: new Set(),
	data: [],
	users: [],
	items: [],
	userSet: new Set(),
	userSelection: new Set(),
	allSelected: true,
	noneSelected: false,
	maxId: null,
	appliedMaxId: null,
	endOfPage: false,
};

enum ACTION {
	RESET = 'init',
	APPEND = 'append',
	SELECT_ALL = 'selectAll',
	SELECT_NONE = 'deselectAll',
	LOAD_NEXT_PAGE = 'loadNextPage',
}

type Actions =
	| {
			type: ACTION.RESET;
	  }
	| {
			type: ACTION.APPEND;
			payload: ResultPage<NotificationObjectType[]>;
	  }
	| {
			type: ACTION.LOAD_NEXT_PAGE;
	  }
	| {
			type: ACTION.SELECT_ALL;
	  }
	| {
			type: ACTION.SELECT_NONE;
	  };

function reducer(state: State, action: Actions) {
	switch (action.type) {
		case ACTION.RESET: {
			return DEFAULT;
		}
		case ACTION.APPEND: {
			const dataCopy = Array.from(state.data);
			const usersCopy = Array.from(state.users);

			return produce(state, (draft) => {
				for (const item of action.payload.data) {
					if (!item.user) continue;
					if (!draft.userSet.has(item.user.id)) {
						draft.userSet.add(item.user.id);
						draft.userSelection.add(item.user.id);
						usersCopy.push(item.user);
					}

					if (draft.seen.has(item.id)) continue;
					draft.seen.add(item.id);
					dataCopy.push(item);
				}
				draft.maxId = action.payload.maxId;
				if (!draft.maxId) draft.endOfPage = true;

				draft.data = dataCopy;
				draft.users = usersCopy;
				// apply filter
				draft.items = dataCopy.filter((o) =>
					draft.userSelection.has(o.user?.id ?? 'N/A'),
				);
			});
		}
		case ACTION.LOAD_NEXT_PAGE: {
			return produce(state, (draft) => {
				draft.appliedMaxId = state.maxId;
			});
		}
		case ACTION.SELECT_ALL: {
			return produce(state, (draft) => {
				draft.allSelected = true;
				draft.userSelection = new Set(state.userSet);
				draft.items = Array.from(state.data);
			});
		}
		case ACTION.SELECT_NONE: {
			return produce(state, (draft) => {
				draft.allSelected = false;
				draft.userSelection = new Set();
				draft.items = [];
			});
		}
	}
}

type DispatchType = Dispatch<Actions>;

// contexts
const StateCtx = createContext<State | null>(null);
const DispatchCtx = createContext<DispatchType | null>(null);
// hooks
const useSubscriptionGalleryState = () => useContext(StateCtx);
const useSubscriptionGalleryDispatch = () => useContext(DispatchCtx);

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
	Ctx as SubscriptionGalleryCtx,
	useSubscriptionGalleryState,
	useSubscriptionGalleryDispatch,
	ACTION as SubscriptionGalleryStateAction,
};
export type {
	State as SubscriptionGalleryStateType,
	DispatchType as SubscriptionGalleryDispatchType,
};
