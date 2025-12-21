import { generateFacets } from '#/utils/atproto-facets.utils';
import { useAppApiClient } from '#/states/global/hooks';
import { useState } from 'react';
import { MessageParser } from '@dhaaga/bridge';
import { ChatroomStateAction, useChatroomDispatch } from '@dhaaga/react';

function useSendMessage(roomId: string) {
	const [IsLoading, setIsLoading] = useState(false);
	const { client } = useAppApiClient();
	const dispatch = useChatroomDispatch();

	async function send(msg: string) {
		setIsLoading(true);
		try {
			const sentMessageResult = await client.notifications.sendMessage(roomId, {
				text: msg,
				facets: generateFacets(msg),
			});
			console.log(sentMessageResult);

			const parsed = MessageParser.parse(sentMessageResult, client);
			dispatch({
				type: ChatroomStateAction.APPEND_MESSAGE,
				payload: parsed,
			});
		} catch (e) {
			console.log(e);
		} finally {
			setIsLoading(false);
		}
	}
	return { send, isLoading: IsLoading };
}

export default useSendMessage;
