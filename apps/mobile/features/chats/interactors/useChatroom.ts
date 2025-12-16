import { useLocalSearchParams } from 'expo-router';
import { AccountMetadataService } from '@dhaaga/db';
import {
	useActiveUserSession,
	useAppApiClient,
	useAppDb,
} from '#/states/global/hooks';
import { useReducer } from 'react';
import {
	chatroomReducer,
	chatroomReducerDefault,
} from '#/states/interactors/chatroom.reducer';
import { generateFacets } from '#/utils/atproto-facets.utils';

function useChatroom() {
	const { db } = useAppDb();
	const { acct } = useActiveUserSession();
	const { driver, client, server } = useAppApiClient();

	const [State, dispatch] = useReducer(chatroomReducer, chatroomReducerDefault);

	// reset the timeline on param change
	const params = useLocalSearchParams();
	const roomId: string = params['roomId'] as string;

	const myId = AccountMetadataService.getAccountDid(db, acct);

	/**
	 * Send the message
	 */
	async function sendMessage(msg: string) {
		const sentMessageResult = await client.notifications.sendMessage(roomId, {
			text: msg,
			facets: generateFacets(msg),
		});

		// dispatch({
		// 	type: ChatroomReducerActionType.APPEND_MESSAGE,
		// 	payload: {
		// 		message: ChatParser.parse<unknown>(sentMessageResult, driver, server),
		// 	},
		// });
	}

	return { state: State, sendMessage, myId };
}

export default useChatroom;
