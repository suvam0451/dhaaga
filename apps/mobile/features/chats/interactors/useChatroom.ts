import { useLocalSearchParams } from 'expo-router';
import {
	useApiGetChatMessages,
	useApiGetChatroom,
} from '../api/useApiGetChats';
import { AccountMetadataService } from '../../../database/entities/account-metadata';
import {
	useAppAcct,
	useAppApiClient,
	useAppDb,
} from '../../../hooks/utility/global-state-extractors';
import { useEffect, useReducer } from 'react';
import {
	chatroomReducer,
	ChatroomReducerActionType,
	chatroomReducerDefault,
} from '../../../states/interactors/chatroom.reducer';
import { generateFacets } from '../../../utils/atproto-facets.utils';
import { ChatMiddleware } from '../../../services/middlewares/chat.middleware';

function useChatroom() {
	const { db } = useAppDb();
	const { acct } = useAppAcct();
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
		if (sentMessageResult.error) {
			throw new Error(sentMessageResult.error.message);
		}

		dispatch({
			type: ChatroomReducerActionType.APPEND_MESSAGE,
			payload: {
				message: ChatMiddleware.deserialize<unknown>(
					sentMessageResult.data,
					driver,
					server,
				),
			},
		});
	}

	return { state: State, sendMessage, myId };
}

export default useChatroom;
