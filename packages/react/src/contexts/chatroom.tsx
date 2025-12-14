import { MessageObjectType, ResultPage, UserObjectType } from '@dhaaga/bridge';
import { produce } from 'immer';
import {
	createContext,
	Dispatch,
	ReactNode,
	useContext,
	useReducer,
} from 'react';

type State = {
	items: MessageObjectType[];
	participants: UserObjectType[];

	// track cursors
	minId?: string | null;
	maxId?: string | null;

	// dedup
	seen: Set<string>;
};

const DEFAULT: State = {
	items: [],
	participants: [],
	seen: new Set(),
};

enum ACTION {
	RESET = 'init',
	SET_PARTICIPANTS = 'setParticipants',
	/**
	 * Will perform eh reconciliation of the message
	 * list, appending the new messages to the end of the list
	 */
	APPEND_PAGE = 'append_PAGE',
}

type Actions =
	| { type: ACTION.RESET }
	| {
			type: ACTION.SET_PARTICIPANTS;
			payload: {
				participants: UserObjectType[];
			};
	  }
	| {
			type: ACTION.APPEND_PAGE;
			payload: ResultPage<MessageObjectType[]>;
	  };

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case ACTION.RESET: {
			return DEFAULT;
		}
		case ACTION.SET_PARTICIPANTS: {
			return {
				...state,
				participants: action.payload.participants,
				seen: new Set(),
			};
		}
		case ACTION.APPEND_PAGE: {
			const copy = Array.from(state.items);

			return produce(state, (draft) => {
				for (const item of action.payload.data) {
					if (state.seen.has(item.id)) continue;
					copy.push(item);
					draft.seen.add(item.id);
				}

				draft.items = copy;
				draft.minId = action.payload.minId; // TODO: not merged in order
				draft.maxId = action.payload.maxId; // TODO: not merged in order
			});
		}
		default:
			return state;
	}
}

type DispatchType = Dispatch<Actions>;

// contexts
const StateCtx = createContext<State>(null!);
const DispatchCtx = createContext<DispatchType>(null!);
// hooks
const useChatroomState = () => useContext(StateCtx);
const useChatroomDispatch = () => useContext(DispatchCtx);
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
	Ctx as ChatroomCtx,
	useChatroomState,
	useChatroomDispatch,
	ACTION as ChatroomStateAction,
};
export type {
	State as PostTimelineStateType,
	DispatchType as PostTimelineDispatchType,
};
