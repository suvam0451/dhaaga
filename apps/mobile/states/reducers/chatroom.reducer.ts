import { AppChatRoom } from '../../services/chat.service';
import { AppMessageObject } from '../../types/app-message.types';
import { produce } from 'immer';
import { Dispatch } from 'react';

type CHATROOM_SEND_STATUS = 'idle' | 'typing' | 'sending' | 'sent';

type State = {
	room: AppChatRoom;
	messages: AppMessageObject[];
	minId: string | undefined;
	sendStatus: 'idle' | 'typing' | 'sending' | 'sent';
};

const DEFAULT: State = {
	room: null,
	messages: [],
	minId: undefined,
	sendStatus: 'idle',
};

enum ACTION {
	RESET,
	INIT_ROOM,
	INIT_MESSAGES,
	APPEND_MESSAGE,
	SET_SEND_STATUS,
}

type Actions =
	| { type: ACTION.RESET }
	| {
			type: ACTION.INIT_ROOM;
			payload: { room: AppChatRoom };
	  }
	| {
			type: ACTION.INIT_MESSAGES;
			payload: {
				messages: AppMessageObject[];
				minId: string | undefined;
			};
	  }
	| {
			type: ACTION.APPEND_MESSAGE;
			payload: {
				message: AppMessageObject;
			};
	  }
	| {
			type: ACTION.SET_SEND_STATUS;
			payload: {
				state: CHATROOM_SEND_STATUS;
			};
	  };

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case ACTION.RESET: {
			return produce(state, (draft) => {
				draft = DEFAULT;
			});
		}
		case ACTION.INIT_ROOM: {
			return produce(state, (draft) => {
				draft.room = action.payload.room;
			});
		}
		case ACTION.INIT_MESSAGES: {
			let _copy = [...action.payload.messages];
			_copy.sort((a, b) =>
				new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
					? 1
					: -1,
			);

			return produce(state, (draft) => {
				draft.messages = _copy;
				draft.minId = action.payload.minId;
			});
		}
		case ACTION.APPEND_MESSAGE: {
			const match = state.messages.find(
				(o) => o.id === action.payload.message?.id,
			);
			if (match) return state;
			return produce(state, (draft) => {
				draft.messages.push(action.payload.message);
			});
		}
		case ACTION.SET_SEND_STATUS: {
			return produce(state, (draft) => {
				draft.sendStatus = action.payload.state;
			});
		}
	}
}

type ChatroomDispatchType = Dispatch<Actions>;
export {
	reducer as chatroomReducer,
	DEFAULT as chatroomReducerDefault,
	ACTION as ChatroomReducerActionType,
	Actions as chatroomReducerActions,
	State as ChatroomReducerStateType,
	ChatroomDispatchType,
};
