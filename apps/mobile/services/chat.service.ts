import { ChatBskyConvoDefs, ChatBskyConvoListConvos } from '@atproto/api';
import { Account, AccountMetadataService, DataSource } from '@dhaaga/db';
import { UserParser, ChatParser, KNOWN_SOFTWARE } from '@dhaaga/bridge';
import type { MessageObjectType, UserObjectType } from '@dhaaga/bridge';

/**
 * Represents a chatroom item
 */
export type AppChatRoom = {
	externalId: string;
	unreadCount: number;
	seen: boolean;
	members: UserObjectType[];
	muted: boolean; // atproto
	lastMessage: MessageObjectType;
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
		const lastMessage = ChatParser.parse(input.lastMessage, driver, server);
		const members = UserParser.parse<unknown[]>(input.members, driver, server);
		return {
			externalId: input.id,
			unreadCount: input.unreadCount,
			muted: input.muted === undefined ? false : input.muted,
			members,
			seen: true,
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
