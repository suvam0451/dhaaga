import { ApiTargetInterface } from '#/client/index.js';
import { MessageObjectType } from '#/types/index.js';
import { KNOWN_SOFTWARE } from '#/client/utils/driver.js';
import { ChatBskyConvoDefs } from '@atproto/api';
import { appMessageObjectSchema } from '#/types/shared/chat.js';

class Parser {
	private static _bundle(
		input: ChatBskyConvoDefs.MessageView | ChatBskyConvoDefs.DeletedMessageView,
		client: ApiTargetInterface,
	): MessageObjectType | null {
		if (!input) return null;
		if (client.driver !== KNOWN_SOFTWARE.BLUESKY) return null;

		if (input.$type === 'chat.bsky.convo.defs#deletedMessageView') {
			return {
				id: input.id,
				deleted: true,
				senderId: input.sender.did,
				content: {
					raw: (input as any).text ?? null,
				},
				embed: null,
				createdAt: new Date(input.sentAt),
				facets: [],
				reactions: [],
			};
		} else if (input.$type === 'chat.bsky.convo.defs#messageView') {
			return {
				id: input.id,
				deleted: false,
				senderId: input.sender.did,
				content: {
					raw: input.text,
				},
				embed: input.embed,
				createdAt: new Date(input.sentAt),
				facets: input.facets ?? [],
				reactions:
					input.reactions?.map((o: any) => ({
						value: o.value,
						senderId: o.sender?.did,
						createdAt: new Date(o.createdAt),
					})) ?? [],
			};
		} else {
			// successful message objects
			return {
				id: input.id,
				deleted: false,
				senderId: input.sender.did,
				content: {
					raw: (input as any).text,
				},
				embed: (input as any).embed, // not tested
				createdAt: new Date(input.sentAt),
				facets: (input as any).facets ?? [],
				reactions:
					(input as any).reactions?.map((o: any) => ({
						value: o.value,
						senderId: o.sender?.did,
						createdAt: new Date(o.createdAt),
					})) ?? [], // not tested
			};
		}
	}

	private static rawToJson(
		input: ChatBskyConvoDefs.MessageView | ChatBskyConvoDefs.DeletedMessageView,
		client: ApiTargetInterface,
	): MessageObjectType | null {
		// prevent infinite recursion
		if (!input) return null;
		if (client.driver !== KNOWN_SOFTWARE.BLUESKY) return null;

		const exported = Parser._bundle(input, client);
		const { data, error, success } = appMessageObjectSchema.safeParse(exported);
		if (!success) {
			console.log('[ERROR]: failed to parse message object:', error);
			// console.log('[INFO]: input object', input);
			return null;
		}
		return data;
	}

	static parse<T>(
		input: T | T[],
		client: ApiTargetInterface,
	): T extends unknown[] ? MessageObjectType[] : MessageObjectType {
		if (Array.isArray(input)) {
			return input
				.filter((o) => !!o)
				.map((o) =>
					Parser.rawToJson(o as any, client),
				) as unknown as T extends unknown[] ? MessageObjectType[] : never;
		} else {
			return Parser.rawToJson(
				input as any,
				client,
			) as unknown as T extends unknown[] ? never : MessageObjectType;
		}
	}
}

export { Parser as MessageParser };
