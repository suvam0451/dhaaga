import { z } from 'zod';
import { appPostObjectSchema } from './app-post.types';

export const appUserObjectSchema = z.object({
	id: z.string(),
	avatarUrl: z.string(),
	displayName: z.string().nullable(),
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
	stats: z.object({
		posts: z.number().nullable(),
		followers: z.number().nullable(),
		following: z.number().nullable(),
	}),
	calculated: z.object({
		emojis: z.map(z.string(), z.string()),
		pinnedPosts: z.array(appPostObjectSchema),
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
export type AppUserObject = z.infer<typeof appUserObjectSchema>;
