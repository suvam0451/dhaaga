import { ChatBskyConvoDefs, ChatBskyConvoListConvos } from '@atproto/api';
import { Account } from '../database/_schema';
import { DataSource } from '../database/dataSource';
import { AccountMetadataService } from '../database/entities/account-metadata';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { ChatMiddleware } from './middlewares/chat.middleware';
import { AppMessageObject } from '../types/app-message.types';
import { UserParser, UserObjectType } from '@dhaaga/core';

/**
 * Represents a chatroom item
 */
export type AppChatRoom = {
	externalId: string;
	unreadCount: number;
	seen: boolean;
	members: UserObjectType[];
	muted: boolean; // atproto
	lastMessage: AppMessageObject;
	myId: string;
};

class ChatService {
	/**
	 * Convert an Atproto ConvoView to
	 * AppChatRoom
	 * @param input
	 * @param driver
	 * @param server
	 * @param myDid
	 */
	static convoToChatroom(
		input: ChatBskyConvoDefs.ConvoView,
		driver: KNOWN_SOFTWARE,
		server: string,
		myDid: string,
	): AppChatRoom {
		const lastMessage = ChatMiddleware.deserialize(
			input.lastMessage,
			driver,
			server,
		);
		const members = UserParser.parse<unknown[]>(input.members, driver, server);
		return {
			externalId: input.id,
			unreadCount: input.unreadCount,
			muted: input.muted === undefined ? false : input.muted,
			members,
			seen: input.opened === undefined ? false : input.opened,
			lastMessage,
			myId: myDid,
		} as AppChatRoom;
	}

	static resolveAtProtoChat(
		db: DataSource,
		data: ChatBskyConvoListConvos.OutputSchema,
		me: Account,
		driver: KNOWN_SOFTWARE,
		server: string,
	) {
		const myDid = AccountMetadataService.getAccountDid(db, me);
		return data.convos.map((o) =>
			ChatService.convoToChatroom(o, driver, server, myDid),
		);
	}
}

export default ChatService;
