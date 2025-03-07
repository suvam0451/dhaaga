import { z } from 'zod';
import { postObjectSchema } from './post.js';
import { appUserObjectSchema, UserParser } from './user.js';
import { PostParser } from './post.js';
import { DriverNotificationType, KNOWN_SOFTWARE } from '../data/driver.js';

const appNotificationGroupedUserItemSchema = z.object({
	item: appUserObjectSchema,
	types: z.array(z.string()),
	extraData: z.any(),
});

type NotificationUserGroupType = z.infer<
	typeof appNotificationGroupedUserItemSchema
>;

export const appNotificationObjectSchema = z.object({
	id: z.string(),
	type: z.string(),
	createdAt: z.date({ coerce: true }),
	user: appUserObjectSchema.nullable(),
	post: postObjectSchema.nullable(),
	extraData: z.any(),
	read: z.boolean(),
	users: z.array(appNotificationGroupedUserItemSchema).optional(),
});

type NotificationObjectType = z.infer<typeof appNotificationObjectSchema>;

class Parser {
	static rawToObject(
		input: any,
		driver: string | KNOWN_SOFTWARE,
		server: string,
	): NotificationObjectType | null {
		if (driver === KNOWN_SOFTWARE.MASTODON) {
			return {
				id: input.id,
				type:
					input['visibility'] === 'direct'
						? DriverNotificationType.CHAT
						: DriverNotificationType.MENTION,
				createdAt: input.createdAt,
				user: UserParser.parse<unknown>(input.account, driver, server),
				post: PostParser.parse<unknown>(input, driver, server) || null,
				extraData: {},
				read: false,
			};
		}
		const obj = {
			id: input.id,
			type: input.type as DriverNotificationType,
			createdAt: input.createdAt,
			groupKey: input.groupKey,
			user: UserParser.parse<unknown>(
				input.account || input.user,
				driver,
				server,
			),
			post: PostParser.parse<unknown>(
				input.status || input.data || input.note,
				driver,
				server,
			),
			extraData: input.reaction,
			// NOTE: check for misskey
			read: input.isRead || false,
		};

		const { data, error, success } = appNotificationObjectSchema.safeParse(obj);
		if (!success) {
			console.log('[ERROR]: notification item dto validation failed', error);
			console.log(input);
			return null;
		}
		return data as NotificationObjectType;
	}

	/**
	 * Deserializes (skips returning the interface step)
	 * raw ap/at proto notification objects
	 * @param input raw ap/at proto notification object
	 * @param driver being used to deserialize this object
	 * @param server
	 */
	static parse<T>(
		input: T | T[],
		driver: string | KNOWN_SOFTWARE,
		server: string,
	): T extends unknown[] ? NotificationObjectType[] : NotificationObjectType {
		if (Array.isArray(input)) {
			return input
				.map((o) => Parser.rawToObject(o, driver, server))
				.filter((o) => !!o) as unknown as T extends unknown[]
				? NotificationObjectType[]
				: never;
		} else {
			return Parser.rawToObject(
				input,
				driver,
				server,
			) as unknown as T extends unknown[] ? never : NotificationObjectType;
		}
	}
}

export { Parser as NotificationParser };

export type { NotificationObjectType, NotificationUserGroupType };
