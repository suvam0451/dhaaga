import { z } from 'zod';

import { appUserObjectSchema, postObjectSchema } from '#/types/index.js';

const appNotificationGroupedUserItemSchema = z.object({
	item: appUserObjectSchema,
	/**
	 * this lets us treat users who liked
	 * and shared separately
	 */
	types: z.array(z.string()),
	extraData: z.any(),
});

const appNotificationObjectSchema = z.object({
	id: z.string(),
	type: z.string(),
	createdAt: z.coerce.date(),
	user: appUserObjectSchema.nullable(),
	post: postObjectSchema.nullable(),
	extraData: z.any(),
	read: z.boolean(),
	users: z.array(appNotificationGroupedUserItemSchema).optional(),
	uri: z.string().optional(),
	cid: z.string().optional(),
});

type NotificationObjectType = z.infer<typeof appNotificationObjectSchema>;

type NotificationUserGroupType = z.infer<
	typeof appNotificationGroupedUserItemSchema
>;

const mastoApiV2NotificationGroupSchema = z.object({
	groupKey: z.string(),
	latestPageNotificationAt: z.date(),
	mostRecentNotificationId: z.number(),
	notificationsCount: z.number(),
	pageMaxId: z.string(),
	pageMinId: z.string(),
	sampleAccountIds: z.array(z.string()),
	statusId: z.string(),
	type: z.enum([
		'mention',
		'status',
		'reblog',
		'follow',
		'follow_request',
		'favourite',
		'poll',
		'update',
		'quote',
		'quoted_update',
		'admin.sign_up',
		'admin.report',
		'severed_relationships',
		'moderation_warning',
	]),
});

type MastoApiGroupedNotificationType = z.infer<
	typeof mastoApiV2NotificationGroupSchema
>;

export {
	appNotificationGroupedUserItemSchema,
	appNotificationObjectSchema,
	mastoApiV2NotificationGroupSchema,
};

export type {
	MastoApiGroupedNotificationType,
	NotificationUserGroupType,
	NotificationObjectType,
};
