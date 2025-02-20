import { z } from 'zod';
import { appUserObjectSchema } from '@dhaaga/core';

export const appFeedObjectSchema = z.object({
	uri: z.string(),
	cid: z.string(),
	did: z.string(),
	creator: appUserObjectSchema,
	displayName: z.string(),
	description: z.string(),
	avatar: z.string().optional(),
	likeCount: z.number().int(),
	labels: z.array(z.any()),
	viewer: z.object({
		like: z.string().optional(),
	}),
	indexedAt: z.date(),
});

export type AppFeedObject = z.infer<typeof appFeedObjectSchema>;
