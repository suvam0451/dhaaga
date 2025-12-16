import { TextNodeParser } from './text-nodes.js';
import { KNOWN_SOFTWARE } from '../client/utils/driver.js';
import {
	ActivityPubUserAdapter,
	UserTargetInterface,
} from '../implementors/profile/_interface.js';
import {
	ActivitypubHelper,
	DriverService,
	RelationObjectType,
} from '../index.js';
import { UserObjectType, appUserObjectSchema } from '#/types/shared/user.js';
import BlueskyUserInterface from '#/implementors/profile/bluesky.js';

export const APP_USER_DEFAULT_RELATIONSHIP = {
	blocking: null,
	blockedBy: null,
	domainBlocking: null,
	followedBy: null,
	following: null,
	muting: null,
	mutingNotifications: null,
	note: null,
	requested: null,
	requestedBy: null,
	showingReblogs: null,
};

class Parser {
	static rawToInterface<T>(
		input: T | T[],
		driver: string | KNOWN_SOFTWARE,
	): T extends unknown[] ? UserTargetInterface[] : UserTargetInterface {
		if (Array.isArray(input)) {
			return input
				.filter((o) => !!o)
				.map((o) =>
					ActivityPubUserAdapter(o, driver),
				) as unknown as T extends unknown[] ? UserTargetInterface[] : never;
		} else {
			return ActivityPubUserAdapter(
				input,
				driver,
			) as unknown as T extends unknown[] ? never : UserTargetInterface;
		}
	}

	/**
	 * @param input a user interface object
	 * @param ctx driver and server info as context
	 * @private
	 */
	static interfaceToJson(
		input: UserTargetInterface,
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

		let relation: RelationObjectType | null = null;

		if (DriverService.supportsAtProto(driver)) {
			const _input = input as BlueskyUserInterface;
			relation = {
				muting: _input.ref.viewer?.muted ?? null,
				blocking: _input.ref.viewer?.blocking ?? null,
				blockedBy: _input.ref.viewer?.blockedBy ?? null,
				following: _input.ref.viewer?.following ?? null,
				followedBy: _input.ref.viewer?.followedBy ?? null,
				showingReblogs: null,
				notifying: null,
				languages: [],
				mutingNotifications: null,
				requested: false,
				domainBlocking: false,
				endorsed: false,
				note: null,
			};
		}

		const dto: UserObjectType = {
			id: input.getId(),
			displayName: input.getDisplayName() || '',
			parsedDisplayName: TextNodeParser.parse(
				driver,
				input.getDisplayName() || '',
			),
			description: input.getDescription() || '',
			parsedDescription: TextNodeParser.parse(
				driver,
				input.getDescription() || '',
				// FIXME: need facets here
			),
			avatarUrl: input.getAvatarUrl() || '',
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
				following: input.getFollowingCount() || 0,
			},
			meta: {
				// NOTE: be careful using these in misskey
				isBot: input.getIsBot() || false,
				isProfileLocked: input.getIsLockedProfile() || false,
				fields: input.getFields() || [],
			},
			calculated: {
				emojis: input.getEmojiMap(), // misskey only
				// pinnedPosts: PostMiddleware.deserialize<unknown[]>(
				// 	input.getPinnedNotes(),
				// 	driver,
				// 	server,
				// ),
			},
			relationship: relation,
		};

		const { data, error, success } = appUserObjectSchema.safeParse(dto);
		if (!success) {
			console.log('[ERROR]: user dto validation failed', error);
			return null;
		}
		return data as UserObjectType;
	}

	/**
	 * Deserializes (skips returning the interface step)
	 * raw ap/at proto user objects
	 * @param input raw ap/at proto user object
	 * @param driver being used to deserialize this object
	 * @param server
	 */
	static parse<T>(
		input: T | T[],
		driver: string | KNOWN_SOFTWARE,
		server: string,
	): T extends unknown[] ? UserObjectType[] : UserObjectType {
		if (Array.isArray(input)) {
			return input
				.map((o) => Parser.rawToInterface<unknown>(o, driver))
				.map((o) =>
					Parser.interfaceToJson(o, {
						driver,
						server,
					}),
				)
				.filter((o) => !!o) as unknown as T extends unknown[]
				? UserObjectType[]
				: never;
		} else {
			return Parser.interfaceToJson(
				Parser.rawToInterface<unknown>(input, driver),
				{
					driver,
					server,
				},
			) as unknown as T extends unknown[] ? never : UserObjectType;
		}
	}
}

export { Parser as UserParser };
