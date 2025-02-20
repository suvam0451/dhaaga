import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { RandomUtil } from '@dhaaga/core';
import { z } from 'zod';

const appMessageObjectSchema = z.object({
	uuid: z.string(),
	id: z.string(),
	sender: z.object({
		id: z.string(),
	}),
	content: z.object({
		raw: z.string().nullable().optional(),
	}),
	createdAt: z.string(),
});

/**
 * Typings for a message object used mostly
 * in the Notifications -> Chat section
 *
 * The object is validated to contain no errors
 */
type MessageObjectType = z.infer<typeof appMessageObjectSchema>;

class Parser {
	private static export(
		input: any,
		driver: KNOWN_SOFTWARE | string,
		server: string,
	): MessageObjectType | null {
		if (!input) return null;
		if (driver !== KNOWN_SOFTWARE.BLUESKY) return null;

		return {
			uuid: RandomUtil.nanoId(),
			id: input.id,
			sender: {
				id: input?.sender?.did,
			},
			createdAt: input.sentAt,
			content: {
				raw: input.text,
			},
		};
	}

	static parse<T>(
		input: T | T[],
		driver: KNOWN_SOFTWARE,
		server: string,
	): T extends unknown[] ? MessageObjectType[] : MessageObjectType {
		if (Array.isArray(input)) {
			return input
				.filter((o) => !!o)
				.map((o) =>
					Parser.rawToJson(o, {
						driver,
						server,
					}),
				) as unknown as T extends unknown[] ? MessageObjectType[] : never;
		} else {
			return Parser.rawToJson(input, {
				driver,
				server,
			}) as unknown as T extends unknown[] ? never : MessageObjectType;
		}
	}

	private static rawToJson(
		input: any,
		{
			driver,
			server,
		}: {
			driver: KNOWN_SOFTWARE | string;
			server: string;
		},
	): MessageObjectType | null {
		// prevent infinite recursion
		if (!input) return null;
		if (driver !== KNOWN_SOFTWARE.BLUESKY) return null;

		const exported = Parser.export(input, driver, server);
		const { data, error, success } = appMessageObjectSchema.safeParse(exported);
		if (!success) {
			console.log('[ERROR]: status item dto validation failed', error);
			console.log('[INFO]: generated object', exported);
			input.print();
			return null;
		}
		return data;
	}
}

export { Parser as ChatParser };
export type { MessageObjectType };
