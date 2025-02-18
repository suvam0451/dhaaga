import { z } from 'zod';
import { appUserObjectSchema } from './app-user.types';
import { appPostObjectSchema } from './app-post.types';

const appNotificationGroupedUserItemSchema = z.object({
	item: appUserObjectSchema,
	types: z.array(z.string()),
	extraData: z.any(),
});

export const appNotificationObjectSchema = z.object({
	id: z.string(),
	type: z.string(),
	createdAt: z.date({ coerce: true }),
	user: appUserObjectSchema.nullable(),
	post: appPostObjectSchema.nullable(),
	extraData: z.any(),
	read: z.boolean(),
	users: z.array(appNotificationGroupedUserItemSchema).optional(),
});

export type AppNotificationObject = z.infer<typeof appNotificationObjectSchema>;
export type AppNotificationGroupedUserItem = z.infer<
	typeof appNotificationGroupedUserItemSchema
>;
