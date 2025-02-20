import { z } from 'zod';
import {
	ActivitypubHelper,
	ActivityPubUserAdapter,
	KNOWN_SOFTWARE,
} from '@dhaaga/bridge';
import type { UserInterface } from '@dhaaga/bridge';
import { TextNodeParser } from './text-nodes';

export const appUserObjectSchema = z.object({
	id: z.string(),
	avatarUrl: z.string(),
	displayName: z.string().nullable(),
	parsedDisplayName: z.array(z.any()),
	// regex(/^@.*?@?.*?$/),
	handle: z.string(),
	instance: z.string(),
	banner: z.string().nullable().optional(),
	meta: z.object({
		isProfileLocked: z.boolean(),
		isBot: z.boolean(),
		fields: z.array(
			z.object({
				// some label behave like this
				name: z.ostring(),
				value: z.ostring(),
				verifiedAt: z.string().nullable().optional(),

				// other labels (feed.creator) behave like this
				cid: z.ostring(),
				cts: z.ostring(),
				src: z.ostring(),
				uri: z.ostring(),
				val: z.ostring(), // e.g. --> "!no-unauthenticated"
			}),
		),
	}),
	description: z.string(),
	parsedDescription: z.array(z.any()),
	stats: z.object({
		posts: z.number().nullable(),
		followers: z.number().nullable(),
		following: z.number().nullable(),
	}),
	calculated: z.object({
		emojis: z.map(z.string(), z.string()),
		// pinnedPosts: z.array(appPostObjectSchema),
	}),
	/**
	 * 	this data block does not need to be cached
	 * 	also, null means not resolved yet
	 */
	relationship: z.object({
		blocking: z.boolean().nullable(),
		blockedBy: z.boolean().nullable(),
		domainBlocking: z.boolean().nullable(),
		followedBy: z.boolean().nullable(),
		following: z.boolean().nullable(),
		muting: z.boolean().nullable(),
		mutingNotifications: z.boolean().nullable(),
		note: z.string().nullable(),
		requested: z.boolean().nullable(),
		requestedBy: z.boolean().nullable(),
		showingReblogs: z.boolean().nullable(),
	}),
});

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

/**
 * This typing stores the user object,
 * as is expected to be passed around throughout
 * the app
 */
type UserObjectType = z.infer<typeof appUserObjectSchema>;

class Parser {
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
			relationship: APP_USER_DEFAULT_RELATIONSHIP,
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
export type { UserObjectType };
