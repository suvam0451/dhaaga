import { z } from 'zod';
import { ActivityPubReactionStateDto } from './approto/activitypub-reactions.service';

export const ActivityPubBoostedByDto = z.object({
	userId: z.string(),
	avatarUrl: z.string(),
	displayName: z.string().nullable().optional(),
	// NOTE: removed regex  --> ,regex(/^@.*?@?.*?$/)
	handle: z.string(),
	instance: z.string(),
});

export const AppActivityPubMediaDto = z.object({
	url: z.string(),
	previewUrl: z.string().nullable().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	alt: z.string().nullable(),
	type: z.string(),
	blurhash: z.string().nullable(),
});

export type AppActivityPubMediaType = z.infer<typeof AppActivityPubMediaDto>;

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
	 * This is the original status id
	 */
	id: z.string(),
	visibility: z.string(),
	createdAt: z.string(),
	postedBy: ActivityPubBoostedByDto,
	content: z.object({
		raw: z.string().nullable().optional(),
		media: z.array(AppActivityPubMediaDto),
	}),
	interaction: z.object({
		boosted: z.boolean(),
		liked: z.boolean(),
		bookmarked: z.boolean(),
	}),
	stats: z.object({
		replyCount: z.number().nonnegative(),
		boostCount: z.number().nonnegative(),
		likeCount: z.number().nonnegative(),
		reactions: ActivityPubReactionStateDto,
	}),
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
	}),
	meta: z.object({
		sensitive: z.boolean(),
		cw: z.string().nullable(),
		isBoost: z.boolean(),
		isReply: z.boolean(),
		mentions: z.array(
			z.object({
				id: z.string(),
				// lazy loaded for misskey forks
				handle: z.string().optional(),
				url: z.string().optional(),
			}),
		),

		// Atproto
		cid: z.string().nullable().optional(),
		uri: z.string().nullable().optional(),
	}),
	state: z.object({
		isBookmarkStateFinal: z.boolean(),
	}),
});

export const ActivityPubStatusLevelTwo = ActivityPubStatusItemDto.extend({
	replyTo: ActivityPubStatusItemDto.nullable().optional(),
	// Misskey/Firefish natively supports quote boosting
	boostedFrom: ActivityPubStatusItemDto.nullable().optional(),
	// Pleroma feature
	quotedFrom: ActivityPubStatusItemDto.nullable().optional(),
});

export const ActivityPubStatusLevelThree = ActivityPubStatusLevelTwo.extend({
	replyTo: ActivityPubStatusLevelTwo.nullable().optional(),
	// Misskey/Firefish natively supports quote boosting
	boostedFrom: ActivityPubStatusLevelTwo.nullable().optional(),
	// Pleroma feature
	quotedFrom: ActivityPubStatusLevelTwo.nullable().optional(),
	// Bluesky feature
	rootPost: ActivityPubStatusItemDto.nullable().optional(),
});

export type ActivityPubStatusAppDtoType_DEPRECATED = z.infer<
	typeof ActivityPubStatusLevelThree
>;
