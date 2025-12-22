import {
	ChatRoomObjectType,
	MessageObjectType,
	ResultPage,
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
	items: MessageObjectType[];
	roomData: ChatRoomObjectType | null;

	// track cursors
	minId?: string | null;
	maxId?: string | null;

	// dedup
	seen: Set<string>;
};

const DEFAULT: State = {
	items: [],
	roomData: null,
	seen: new Set(),
};

enum ACTION {
	RESET = 'init',
	SET_ROOM_DATA = 'setRoomData',
	/**
	 * Will perform eh reconciliation of the message
	 * list, appending the new messages to the end of the list
	 */
	APPEND_PAGE = 'append_PAGE',
	APPEND_MESSAGE = 'append_MESSAGE',
}

type Actions =
	| { type: ACTION.RESET }
	| {
			type: ACTION.SET_ROOM_DATA;
			payload: {
				roomData: ChatRoomObjectType;
			};
	  }
	| {
			type: ACTION.APPEND_PAGE;
			payload: ResultPage<MessageObjectType[]>;
	  }
	| {
			type: ACTION.APPEND_MESSAGE;
			payload: MessageObjectType;
	  };

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case ACTION.RESET: {
			return DEFAULT;
		}
		case ACTION.SET_ROOM_DATA: {
			return {
				...state,
				roomData: action.payload.roomData,
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

				draft.items = copy.sort(
					(a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
				);
				draft.minId = action.payload.minId; // TODO: not merged in order
				draft.maxId = action.payload.maxId; // TODO: not merged in order
			});
		}
		case ACTION.APPEND_MESSAGE: {
			const copy = Array.from(state.items);

			return produce(state, (draft) => {
				copy.push(action.payload);
				draft.seen.add(action.payload.id);

				draft.items = copy.sort(
					(a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
				);
				draft.minId = draft.minId;
				draft.maxId = action.payload.id;
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
