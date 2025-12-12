import { z } from 'zod';
import { postLinkAttachmentObjectSchema } from '#/types/shared/link-attachments.js';
import { PostTargetInterface } from '#/implementors/index.js';

const ActivityPubReactionStateSchema = z.array(
	z.object({
		id: z.string(),
		count: z.number().positive(),
		me: z.boolean(),
		accounts: z.array(z.string()),
		url: z.string().nullable().optional(),
	}),
);
type ActivityPubReactionStateType = z.infer<
	typeof ActivityPubReactionStateSchema
>;
const ActivityPubBoostedByDto = z.object({
	id: z.string(),
	avatarUrl: z.string(),
	displayName: z.string().nullable().optional(),
	parsedDisplayName: z.array(z.any()),
	handle: z.string().regex(/^@.*?@?.*?$/),
	instance: z.string(),
});
type PostAuthorType = z.infer<typeof ActivityPubBoostedByDto>;
const AppActivityPubMediaDto = z.object({
	url: z.string(),
	previewUrl: z.string().nullable().optional(),
	width: z.number().optional().nullable(), // bsky can be null
	height: z.number().optional().nullable(), // bsky can be null
	alt: z.string().nullable(),
	type: z.string(),
	blurhash: z.string().nullable(),
});
type PostMediaAttachmentType = z.infer<typeof AppActivityPubMediaDto>;
const AppPostStatsDto = z.object({
	replyCount: z.number().nonnegative(),
	boostCount: z.number().nonnegative(),
	likeCount: z.number().nonnegative(),
	reactions: ActivityPubReactionStateSchema,
});
type PostStatsType = z.infer<typeof AppPostStatsDto>;
/**
 * This payload is used to consume
 * the Status Interface inside
 * the FlashLists
 *
 * Everything is calculated in advance
 * for efficient list renders
 */
export const ActivityPubStatusItemDto = z.object({
	/**
	 * This is the in-app id
	 */
	uuid: z.string(),
	/**
	 * This is the original status id
	 */
	id: z.string(),
	visibility: z.string(),
	createdAt: z.string(),
	postedBy: ActivityPubBoostedByDto,
	content: z.object({
		raw: z.string().nullable().optional(),
		parsed: z.array(z.any()),
		media: z.array(AppActivityPubMediaDto),
		links: z.array(postLinkAttachmentObjectSchema),
	}),
	interaction: z.object({
		boosted: z.boolean(),
		liked: z.boolean(),
		bookmarked: z.boolean(),
	}),
	stats: AppPostStatsDto,
	calculated: z.object({
		mediaContainerHeight: z.number(),
		emojis: z.map(z.string(), z.string()),
		translationOutput: z.string().optional(),
		translationType: z.string().optional(),
		reactionEmojis: z.array(
			z.object({
				height: z.number().nullable().optional(),
				width: z.number().nullable().optional(),
				name: z.string(),
				url: z.string().url(),
			}),
		),
		mentions: z.array(
			z.object({
				id: z.string().optional().nullable(),
				text: z.string().optional(),
				url: z.string().nullable().optional(),
				username: z.string().optional().nullable(),
				acct: z.string().optional().nullable(),
			}),
		),
		customEmojiCount: z.number().optional(),
	}),
	meta: z.object({
		sensitive: z.boolean(),
		cw: z.string().nullable(),
		isBoost: z.boolean(),
		isReply: z.boolean(),
		mentions: z.array(
			z.object({
				id: z.string(), // lazy loaded for misskey forks
				handle: z.string().optional(),
				// mastoAPI
				url: z.string().optional(),
				acct: z.string().optional().nullable(),
				username: z.string().optional().nullable(),
			}),
		),

		// Atproto
		cid: z.string().nullable().optional(),
		uri: z.string().nullable().optional(),
	}),
	state: z.object({
		isBookmarkStateFinal: z.boolean(),
	}),
	atProto: z
		.object({
			viewer: z
				.object({
					like: z.string().nullable().optional(),
					embeddingDisabled: z.boolean().optional(),
					pinned: z.any().optional(),
					repost: z.any().optional(),
					replyDisabled: z.boolean().optional(),
					threadMuted: z.boolean().optional(),
				})
				.optional(),
		})
		.nullable()
		.optional(),
});
const ActivityPubStatusLevelTwo = ActivityPubStatusItemDto.extend({
	replyTo: ActivityPubStatusItemDto.nullable().optional(), // Misskey/Firefish natively supports quote boosting
	boostedFrom: ActivityPubStatusItemDto.nullable().optional(), // Pleroma feature
	quotedFrom: ActivityPubStatusItemDto.nullable().optional(),
});
const postObjectSchema = ActivityPubStatusLevelTwo.extend({
	replyTo: ActivityPubStatusLevelTwo.nullable().optional(), // Misskey/Firefish natively supports quote boosting
	boostedFrom: ActivityPubStatusLevelTwo.nullable().optional(), // Pleroma feature
	quotedFrom: ActivityPubStatusLevelTwo.nullable().optional(), // Bluesky feature
	rootPost: ActivityPubStatusItemDto.nullable().optional(),
});

/**
 * Typings for a post object used throughout the app.
 *
 * The object is validated to contain no errors
 */
type PostObjectType = z.infer<typeof postObjectSchema>;
type PostRootObjectType = z.infer<typeof ActivityPubStatusItemDto>;

const mentionObjectSchema = z.object({
	id: z.string(),
	handle: z.string().optional(),
	url: z.string().optional(),
	acct: z.string().optional().nullable(),
	username: z.string().optional().nullable(),
});

type PostMentionObjectType = z.infer<typeof mentionObjectSchema>;

type DhaagaPostThreadInterfaceType = {
	ancestors: {
		id: string;
		depth: number;
		post: PostTargetInterface;
	}[];
	descendants: { id: string; depth: number; post: PostTargetInterface }[];
	rootInterface?: { id: string; depth: number; post: PostTargetInterface };
	rootObject?: PostObjectType;
};

export { postObjectSchema };
export type {
	PostRootObjectType,
	PostStatsType,
	PostObjectType,
	PostAuthorType,
	PostMediaAttachmentType,
	ActivityPubReactionStateType,
	PostMentionObjectType,
	DhaagaPostThreadInterfaceType,
};
