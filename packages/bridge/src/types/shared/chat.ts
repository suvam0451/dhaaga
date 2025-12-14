import { z } from 'zod';

/**
 * --- MORE PARTICIPANT INFO
 *
"associated": {
	"lists": 1,
		"feedgens": 0,
		"starterPacks": 0,
		"labeler": false,
		"chat": {
		"allowIncoming": "all"
	},
	"activitySubscription": {
		"allowSubscriptions": "followers"
	}
},
"viewer": {
	"muted": false,
		"blockedBy": false,
		"following": "at://did:plc:apj4e77xzasoqhoo55kkbkwu/app.bsky.graph.follow/3l4hfegpfml2o"
},

 */

const appMessageObjectSchema = z.object({
	id: z.string(),
	senderId: z.string(),
	content: z.object({
		raw: z.string().nullable().optional(),
	}),
	embed: z.any().nullable(),
	createdAt: z.coerce.date(),
	facets: z.array(z.any()),
	reactions: z.array(
		z.object({
			value: z.string(),
			senderId: z.string(),
			createdAt: z.coerce.date(),
		}),
	),
	deleted: z.boolean(),
});

const appChatRoomObjectSchema = z.object({
	id: z.string(),
	members: z.array(
		z.object({
			id: z.string(),
			handle: z.string(),
			displayName: z.string().optional(),
			avatar: z.string().optional(),
		}),
	),
	unreadCount: z.number().nullable(),
	muting: z.boolean(),
	lastMessage: appMessageObjectSchema.nullable(),
});

/**
 * Typings for a message object used mostly
 * in the Notifications -> Chat section
 *
 * The object is validated to contain no errors
 */
type MessageObjectType = z.infer<typeof appMessageObjectSchema>;
type ChatRoomObjectType = z.infer<typeof appChatRoomObjectSchema>;

export { appMessageObjectSchema, appChatRoomObjectSchema };
export type { MessageObjectType, ChatRoomObjectType };
