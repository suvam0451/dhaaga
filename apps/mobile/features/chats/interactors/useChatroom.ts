import { useLocalSearchParams } from 'expo-router';
import {
	useApiGetChatMessages,
	useApiGetChatroom,
} from '../api/useApiGetChats';
import { AccountMetadataService } from '@dhaaga/db';
import {
	useActiveUserSession,
	useAppApiClient,
	useAppDb,
} from '#/states/global/hooks';
import { useEffect, useReducer } from 'react';
import {
	chatroomReducer,
	ChatroomReducerActionType,
	chatroomReducerDefault,
} from '../../../states/interactors/chatroom.reducer';
import { generateFacets } from '../../../utils/atproto-facets.utils';
import { ChatParser } from '@dhaaga/bridge';

function useChatroom() {
	const { db } = useAppDb();
	const { acct } = useActiveUserSession();
	const { driver, client, server } = useAppApiClient();

	const [State, dispatch] = useReducer(chatroomReducer, chatroomReducerDefault);

	// reset the timeline on param change
	const params = useLocalSearchParams();
	const roomId: string = params['roomId'] as string;

	const { data: RoomData } = useApiGetChatroom(roomId);
	const { data: nextMessages } = useApiGetChatMessages(roomId, undefined);

	const myId = AccountMetadataService.getAccountDid(db, acct);

	// reset on room change!
	useEffect(() => {
		dispatch({
			type: ChatroomReducerActionType.RESET,
		});
		return;
	}, [roomId]);

	useEffect(() => {
		if (!RoomData || !nextMessages) {
			dispatch({
				type: ChatroomReducerActionType.RESET,
			});
			return;
		}
		dispatch({
			type: ChatroomReducerActionType.INIT_ROOM,
			payload: {
				room: RoomData,
			},
		});
		dispatch({
			type: ChatroomReducerActionType.INIT_MESSAGES,
			payload: {
				messages: nextMessages.items,
				minId: nextMessages.cursor,
			},
		});
	}, [RoomData, nextMessages]);

	/**
	 * Send the message
	 */
	async function sendMessage(msg: string) {
		const sentMessageResult = await client.notifications.sendMessage(roomId, {
			text: msg,
			facets: generateFacets(msg),
		});

		dispatch({
			type: ChatroomReducerActionType.APPEND_MESSAGE,
			payload: {
				message: ChatParser.parse<unknown>(sentMessageResult, driver, server),
			},
		});
	}

	return { state: State, sendMessage, myId };
}

export default useChatroom;
