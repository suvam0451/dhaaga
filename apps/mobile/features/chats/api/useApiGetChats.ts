import { useActiveUserSession, useAppApiClient } from '#/states/global/hooks';
import { useQuery } from '@tanstack/react-query';
import {
	ChatParser,
	ChatRoomObjectType,
	KNOWN_SOFTWARE,
	MessageParser,
	ResultPage,
} from '@dhaaga/bridge';
import type { MessageObjectType } from '@dhaaga/bridge';

/**
 * Helper function to refetch details
 * of a conversation/chat/room
 * @param roomId
 */
function useApiGetChatroom(roomId: string) {
	const { driver, client, server } = useAppApiClient();
	const { acct } = useActiveUserSession();

	async function api(): Promise<ChatRoomObjectType> {
		const result = await client.notifications.getChatDetails(roomId);
		switch (driver) {
			case KNOWN_SOFTWARE.BLUESKY: {
				console.log(result);
				return ChatParser.parse<unknown>(result, client);
				// const myDid = AccountMetadataService.getAccountDid(db, acct);
				// const _data: ChatBskyConvoGetConvo.OutputSchema = result.data;
				// return ChatService.convoToChatroom(_data.convo, driver, server, myDid);
			}
			default: {
				throw new Error(`Feature not available for: ${driver}`);
			}
		}
	}

	// Queries
	return useQuery<ChatRoomObjectType>({
		queryKey: ['dhaaga/chatroom', acct, roomId],
		queryFn: api,
		enabled: client !== null,
		initialData: null,
	});
}

/**
 * Fetch chat messages for this chatroom
 * @param roomId
 * @param maxId
 */
function useApiGetChatMessages(roomId: string, maxId: string | undefined) {
	const { client } = useAppApiClient();

	async function api(): Promise<ResultPage<MessageObjectType[]>> {
		const result = await client.notifications.getChatMessages(roomId);
		switch (client.driver) {
			case KNOWN_SOFTWARE.BLUESKY: {
				return {
					data: MessageParser.parse<unknown[]>(result.data, client),
					maxId: result.maxId,
				};
			}
			default: {
				throw new Error(`Unsupported driver: ${client.driver}`);
			}
		}
	}

	// Queries
	return useQuery<ResultPage<MessageObjectType[]>>({
		queryKey: ['chatroom', maxId, roomId],
		queryFn: api,
		enabled: client !== null,
		initialData: null,
	});
}

export { useApiGetChatroom, useApiGetChatMessages };
