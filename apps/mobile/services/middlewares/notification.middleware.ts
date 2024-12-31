import { DhaagaJsNotificationType, KNOWN_SOFTWARE } from '@dhaaga/bridge';
import {
	AppNotificationObject,
	appNotificationObjectSchema,
} from '../../types/app-notification.types';
import { UserMiddleware } from './user.middleware';
import { PostMiddleware } from './post.middleware';

/**
 * converts raw objects (unlike post
 * and user) into light-weight JSON
 * objects, to be consumed by the app
 *
 * This middleware deals with post
 * objects. Also see other files
 * in this folder
 */
export class NotificationMiddleware {
	static rawToObject(
		input: any,
		driver: string | KNOWN_SOFTWARE,
		server: string,
	): AppNotificationObject {
		if (driver === KNOWN_SOFTWARE.MASTODON) {
			return {
				id: input.id,
				type:
					input['visibility'] === 'direct'
						? DhaagaJsNotificationType.CHAT
						: DhaagaJsNotificationType.MENTION,
				createdAt: input.createdAt,
				user: UserMiddleware.deserialize<unknown>(
					input.account,
					driver,
					server,
				),
				post: PostMiddleware.deserialize<unknown>(input, driver, server),
				extraData: {},
				read: false,
			};
		}
		const obj = {
			id: input.id,
			type: input.type as DhaagaJsNotificationType,
			createdAt: input.createdAt,
			groupKey: input.groupKey,
			user: UserMiddleware.deserialize<unknown>(
				input.account || input.user,
				driver,
				server,
			),
			post: PostMiddleware.deserialize<unknown>(
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
		return data as AppNotificationObject;
	}

	/**
	 * Deserializes (skips returning the interface step)
	 * raw ap/at proto notification objects
	 * @param input raw ap/at proto notification object
	 * @param driver being used to deserialize this object
	 * @param server
	 */
	static deserialize<T>(
		input: T | T[],
		driver: string | KNOWN_SOFTWARE,
		server: string,
	): T extends unknown[] ? AppNotificationObject[] : AppNotificationObject {
		if (Array.isArray(input)) {
			return input
				.map((o) => NotificationMiddleware.rawToObject(o, driver, server))
				.filter((o) => !!o) as unknown as T extends unknown[]
				? AppNotificationObject[]
				: never;
		} else {
			return NotificationMiddleware.rawToObject(
				input,
				driver,
				server,
			) as unknown as T extends unknown[] ? never : AppNotificationObject;
		}
	}
}
