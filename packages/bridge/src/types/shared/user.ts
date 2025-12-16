import { z } from 'zod';
import { appRelationObjectSchema } from '#/types/shared/relationship.js';

const appUserObjectSchema = z.object({
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
				// some label behaves like this
				name: z.string().optional(),
				value: z.string().optional(),
				verifiedAt: z.string().nullable().optional(),

				// other labels (feed.creator) behave like this
				cid: z.string().optional(),
				cts: z.string().optional(),
				src: z.string().optional(),
				uri: z.string().optional(),
				val: z.string().optional(), // e.g. --> "!no-unauthenticated"
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
	relationship: appRelationObjectSchema.nullable(),
	// knownFollowers: z
	// 	.object({
	// 		$type: z.literal('app.bsky.actor.defs#knownFollowers').optional(),
	// 		count: z.number(),
	// 		followers: z.array(appUserObjectSchema),
	// 	})
	// 	.optional(),
});

/**
 * This typing stores the user object,
 * as is expected to be passed around throughout
 * the app
 */
type UserObjectType = z.infer<typeof appUserObjectSchema>;

export { appUserObjectSchema };
export type { UserObjectType };
