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
