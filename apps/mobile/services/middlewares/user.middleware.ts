import {
	ActivitypubHelper,
	ActivityPubUserAdapter,
	KNOWN_SOFTWARE,
	UserInterface,
} from '@dhaaga/bridge';
import {
	APP_USER_DEFAULT_RELATIONSHIP,
	AppUserObject,
	appUserObjectSchema,
} from '../../types/app-user.types';
import { PostMiddleware } from './post.middleware';

export class UserMiddleware {
	static rawToInterface<T>(
		input: T | T[],
		driver: string | KNOWN_SOFTWARE,
	): T extends unknown[] ? UserInterface[] : UserInterface {
		if (Array.isArray(input)) {
			return input
				.filter((o) => !!o)
				.map((o) =>
					ActivityPubUserAdapter(o, driver),
				) as unknown as T extends unknown[] ? UserInterface[] : never;
		} else {
			return ActivityPubUserAdapter(
				input,
				driver,
			) as unknown as T extends unknown[] ? never : UserInterface;
		}
	}

	/**
	 * @param input a user interface object
	 * @param ctx driver and server info as context
	 * @private
	 */
	static interfaceToJson(
		input: UserInterface,
		{
			driver,
			server,
		}: {
			driver: KNOWN_SOFTWARE | string;
			server: string;
		},
	) {
		// prevent infinite recursion
		if (!input || !input.getId()) return null;

		const dto: AppUserObject = {
			id: input.getId(),
			displayName: input.getDisplayName(),
			description: input.getDescription() || '',
			avatarUrl: input.getAvatarUrl(),
			banner: input.getBannerUrl(),
			handle: ActivitypubHelper.getHandle(
				input?.getAccountUrl(server),
				server,
				driver,
			),
			instance: input.getInstanceUrl() || server,
			stats: {
				posts: input.getPostCount() || 0,
				followers: input.getFollowersCount() || 0,
				following: input.getFollowersCount() || 0,
			},
			meta: {
				// NOTE: be careful using these in misskey
				isBot: input.getIsBot() || false,
				isProfileLocked: input.getIsLockedProfile() || false,
				fields: input.getFields() || [],
			},
			calculated: {
				emojis: input.getEmojiMap(), // misskey only
				pinnedPosts: PostMiddleware.deserialize<unknown[]>(
					input.getPinnedNotes(),
					driver,
					server,
				),
			},
			relationship: APP_USER_DEFAULT_RELATIONSHIP,
		};

		const { data, error, success } = appUserObjectSchema.safeParse(dto);
		if (!success) {
			console.log('[ERROR]: user dto validation failed', error);
			return null;
		}
		return data as AppUserObject;
	}

	/**
	 * Deserializes (skips returning the interface step)
	 * raw ap/at proto user objects
	 * @param input raw ap/at proto user object
	 * @param driver being used to deserialize this object
	 * @param server
	 */
	static deserialize<T>(
		input: T | T[],
		driver: string | KNOWN_SOFTWARE,
		server: string,
	): T extends unknown[] ? AppUserObject[] : AppUserObject {
		if (Array.isArray(input)) {
			return input
				.map((o) => UserMiddleware.rawToInterface<unknown>(o, driver))
				.map((o) =>
					UserMiddleware.interfaceToJson(o, {
						driver,
						server,
					}),
				)
				.filter((o) => !!o) as unknown as T extends unknown[]
				? AppUserObject[]
				: never;
		} else {
			return UserMiddleware.interfaceToJson(
				UserMiddleware.rawToInterface<unknown>(input, driver),
				{
					driver,
					server,
				},
			) as unknown as T extends unknown[] ? never : AppUserObject;
		}
	}
}
