import { generateFacets } from '#/utils/atproto-facets.utils';
import { useAppApiClient } from '#/states/global/hooks';
import { useState } from 'react';
import { MessageParser } from '@dhaaga/bridge';
import { ChatroomStateAction, useChatroomDispatch } from '@dhaaga/react';
import { TextInput } from 'react-native';
import { LegendListRef } from '@legendapp/list';

function useSendMessage(
	roomId: string,
	listRef: React.RefObject<LegendListRef>,
	inputRef: React.RefObject<TextInput>,
) {
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

			const parsed = MessageParser.parse(sentMessageResult, client);
			dispatch({
				type: ChatroomStateAction.APPEND_MESSAGE,
				payload: parsed,
			});

			setTimeout(() => {
				inputRef?.current?.blur();
			}, 200);

			setTimeout(() => {
				listRef?.current?.scrollToEnd({ animated: false });
			}, 500);
		} catch (e) {
			console.log(e);
		} finally {
			setIsLoading(false);
		}
	}
	return { send, isLoading: IsLoading };
}

export default useSendMessage;
