import { z } from 'zod';

import { appUserObjectSchema, postObjectSchema } from '#/types/index.js';

const appNotificationGroupedUserItemSchema = z.object({
	item: appUserObjectSchema,
	types: z.array(z.string()),
	extraData: z.any(),
});

type NotificationObjectType = z.infer<typeof appNotificationObjectSchema>;

const appNotificationObjectSchema = z.object({
	id: z.string(),
	type: z.string(),
	createdAt: z.coerce.date(),
	user: appUserObjectSchema.nullable(),
	post: postObjectSchema.nullable(),
	extraData: z.any(),
	read: z.boolean(),
	users: z.array(appNotificationGroupedUserItemSchema).optional(),
});

type NotificationUserGroupType = z.infer<
	typeof appNotificationGroupedUserItemSchema
>;

export { appNotificationGroupedUserItemSchema, appNotificationObjectSchema };
export type { NotificationUserGroupType, NotificationObjectType };
