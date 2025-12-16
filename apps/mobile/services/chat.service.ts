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

class ChatService {}

export default ChatService;
