import { z } from 'zod';
import { appUserObjectSchema } from '#/types/index.js';

const feedObjectSchema = z.object({
	uri: z.string(),
	cid: z.string(),
	did: z.string(),
	creator: appUserObjectSchema,
	displayName: z.string(),
	description: z.string().optional(),
	avatar: z.string().optional(),
	likeCount: z.number().int().optional(),
	labels: z.array(z.any()).optional(),
	viewer: z.object({
		like: z.string().optional(),
	}),
	indexedAt: z.date(),
	/**
	 * these need to resolve at runtime
	 */
	saved: z.boolean().nullable(),
	pinned: z.boolean().nullable(),
});

type FeedObjectType = z.infer<typeof feedObjectSchema>;

export { feedObjectSchema };
export type { FeedObjectType };
