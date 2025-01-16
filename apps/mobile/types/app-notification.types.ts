import { z } from 'zod';
import { appUserObjectSchema } from './app-user.types';
import { appPostObjectSchema } from './app-post.types';

export const appNotificationObjectSchema = z.object({
	id: z.string(),
	type: z.string(),
	createdAt: z.date({ coerce: true }),
	user: appUserObjectSchema.nullable(),
	post: appPostObjectSchema.nullable(),
	extraData: z.any(),
	read: z.boolean(),
});

export type AppNotificationObject = z.infer<typeof appNotificationObjectSchema>;
