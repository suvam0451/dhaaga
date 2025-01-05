import {
	useAppAcct,
	useAppApiClient,
	useAppDb,
} from '../../utility/global-state-extractors';
import { useQuery } from '@tanstack/react-query';
import ChatService, { AppChatRoom } from '../../../services/chat.service';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { ChatBskyConvoGetConvo, ChatBskyConvoGetMessages } from '@atproto/api';
import { AccountMetadataService } from '../../../database/entities/account-metadata';
import { ChatMiddleware } from '../../../services/middlewares/chat.middleware';
import { AppMessageObject } from '../../../types/app-message.types';

/**
 * Helper function to refetch details
 * of a conversation/chat/room
 * @param roomId
 */
function useApiGetChatroom(roomId: string) {
	const { driver, client, server } = useAppApiClient();
	const { acct } = useAppAcct();
	const { db } = useAppDb();

	async function api(): Promise<AppChatRoom> {
		const result = await client.notifications.getChat(roomId);
		if (result.error) throw new Error(result.error.message);
		switch (driver) {
			case KNOWN_SOFTWARE.BLUESKY: {
				const myDid = AccountMetadataService.getAccountDid(db, acct);
				const _data: ChatBskyConvoGetConvo.OutputSchema = result.data;
				return ChatService.convoToChatroom(_data.convo, driver, server, myDid);
			}
			default: {
				return null;
			}
		}
	}

	// Queries
	return useQuery<AppChatRoom>({
		queryKey: ['chatroom', acct, roomId],
		queryFn: api,
		enabled: client !== null,
		initialData: null,
	});
}

type GetChatMessagesResponse = {
	items: AppMessageObject[];
	cursor: string | undefined;
};

/**
 * Fetch chat messages for this chatroom
 * @param roomId
 * @param maxId
 */
function useApiGetChatMessages(roomId: string, maxId: string | undefined) {
	const { driver, client, server } = useAppApiClient();

	async function api(): Promise<GetChatMessagesResponse> {
		const result = await client.notifications.getMessages(roomId);
		if (result.error) throw new Error(result.error.message);
		switch (driver) {
			case KNOWN_SOFTWARE.BLUESKY: {
				const _data: ChatBskyConvoGetMessages.OutputSchema = result.data;
				return {
					items: ChatMiddleware.deserialize<unknown[]>(
						_data.messages,
						driver,
						server,
					),
					cursor: _data.cursor,
				};
			}
			default: {
				return null;
			}
		}
	}

	// Queries
	return useQuery<GetChatMessagesResponse>({
		queryKey: ['chatroom', maxId, roomId],
		queryFn: api,
		enabled: client !== null,
		initialData: null,
	});
}

export { useApiGetChatroom, useApiGetChatMessages };
