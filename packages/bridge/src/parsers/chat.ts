import { KNOWN_SOFTWARE } from '../client/utils/driver.js';
import {
	appChatRoomObjectSchema,
	ChatRoomObjectType,
} from '#/types/shared/chat.js';
import { ChatBskyConvoDefs } from '@atproto/api';
import { ApiTargetInterface } from '#/client/index.js';
import { MessageParser } from '#/parsers/message.js';

class Parser {
	private static _bundle(
		input: ChatBskyConvoDefs.ConvoView,
		client: ApiTargetInterface,
	): ChatRoomObjectType | null {
		if (!input) return null;
		if (client.driver !== KNOWN_SOFTWARE.BLUESKY) return null;

		return {
			id: input.id,
			members: input.members.map((o) => ({
				id: o.did,
				handle: o.handle,
				displayName: o.displayName,
				avatar: o.avatar,
			})),
			unreadCount: input.unreadCount,
			muting: input.muted,
			lastMessage: MessageParser.parse(input.lastMessage, client),
		};
	}

	private static rawToJson(
		input: ChatBskyConvoDefs.ConvoView,
		client: ApiTargetInterface,
	): ChatRoomObjectType | null {
		// prevent infinite recursion
		if (!input) return null;
		if (client.driver !== KNOWN_SOFTWARE.BLUESKY) return null;

		const exported = Parser._bundle(input, client);
		const { data, error, success } =
			appChatRoomObjectSchema.safeParse(exported);
		if (!success) {
			console.log('[ERROR]: status item dto validation failed', error);
			// console.log('[INFO]: input object', input);
			// input.print();
			return null;
		}
		return data;
	}

	static parse<T>(
		input: T | T[],
		client: ApiTargetInterface,
	): T extends unknown[] ? ChatRoomObjectType[] : ChatRoomObjectType {
		if (Array.isArray(input)) {
			return input
				.filter((o) => !!o)
				.map((o) =>
					Parser.rawToJson(o as any, client),
				) as unknown as T extends unknown[] ? ChatRoomObjectType[] : never;
		} else {
			return Parser.rawToJson(
				input as any,
				client,
			) as unknown as T extends unknown[] ? never : ChatRoomObjectType;
		}
	}
}

export { Parser as ChatParser };
