import { z } from 'zod';

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
				name: z.string(),
				value: z.string(),
				verifiedAt: z.string().nullable().optional(),
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
	}),
});

/**
 * This typing stores the user object,
 * as is expected to be passed around throughout
 * the app
 */
export type AppUserObject = z.infer<typeof appUserObjectSchema>;
