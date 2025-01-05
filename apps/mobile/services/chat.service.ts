import { ChatBskyConvoListConvos } from '@atproto/api';
import { Account } from '../database/_schema';
import { DataSource } from '../database/dataSource';
import {
	ACCOUNT_METADATA_KEY,
	AccountMetadataService,
} from '../database/entities/account-metadata';
import { AppUserObject } from '../types/app-user.types';
import { UserMiddleware } from './middlewares/user.middleware';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { ChatMiddleware } from './middlewares/chat.middleware';
import { AppMessageObject } from '../types/app-message.types';

/**
 * Represents a chatroom item
 */
export type AppChatRoom = {
	externalId: string;
	unreadCount: number;
	seen: boolean;
	members: AppUserObject[];
	muted: boolean; // atproto
	lastMessage: AppMessageObject;
	myId: string;
};

class ChatService {
	static resolveAtProtoChat(
		db: DataSource,
		data: ChatBskyConvoListConvos.OutputSchema,
		me: Account,
		driver: KNOWN_SOFTWARE,
		server: string,
	) {
		const myDid = AccountMetadataService.getKeyValueForAccountSync(
			db,
			me,
			ACCOUNT_METADATA_KEY.ATPROTO_DID,
		);
		return data.convos.map((o) => {
			const lastMessage = ChatMiddleware.deserialize(
				o.lastMessage,
				driver,
				server,
			);
			const members = UserMiddleware.deserialize<unknown[]>(
				o.members,
				driver,
				server,
			);
			return {
				externalId: o.id,
				unreadCount: o.unreadCount,
				muted: o.muted === undefined ? false : o.muted,
				members,
				seen: o.opened === undefined ? false : o.seen,
				lastMessage,
				myId: myDid,
			} as AppChatRoom;
		});
	}
}

export default ChatService;
