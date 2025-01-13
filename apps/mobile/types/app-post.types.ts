import { z } from 'zod';
import {
	ActivitypubHelper,
	BlueskyStatusAdapter,
	StatusInterface,
} from '@dhaaga/bridge';
import MediaService from '../services/media.service';
import { Dimensions } from 'react-native';
import { MEDIA_CONTAINER_MAX_HEIGHT } from '../components/common/media/_common';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { ActivityPubReactionStateDto } from '../services/approto/activitypub-reactions.service';
import { RandomUtil } from '../utils/random.utils';
import { UserMiddleware } from '../services/middlewares/user.middleware';
import { DataSource } from '../database/dataSource';
import { AccountSavedPost } from '../database/_schema';

export const ActivityPubBoostedByDto = z.object({
	userId: z.string(),
	avatarUrl: z.string(),
	displayName: z.string().nullable().optional(),
	handle: z.string().regex(/^@.*?@?.*?$/),
	instance: z.string(),
});

export type AppPostAuthorType = z.infer<typeof ActivityPubBoostedByDto>;

export const AppActivityPubMediaDto = z.object({
	url: z.string(),
	previewUrl: z.string().nullable().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	alt: z.string().nullable(),
	type: z.string(),
	blurhash: z.string().nullable(),
});

export type AppMediaObject = z.infer<typeof AppActivityPubMediaDto>;

export const AppPostStatsDto = z.object({
	replyCount: z.number().nonnegative(),
	boostCount: z.number().nonnegative(),
	likeCount: z.number().nonnegative(),
	reactions: ActivityPubReactionStateDto,
});

export type AppPostStats = z.infer<typeof AppPostStatsDto>;

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
		media: z.array(AppActivityPubMediaDto),
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

export const ActivityPubStatusLevelTwo = ActivityPubStatusItemDto.extend({
	replyTo: ActivityPubStatusItemDto.nullable().optional(), // Misskey/Firefish natively supports quote boosting
	boostedFrom: ActivityPubStatusItemDto.nullable().optional(), // Pleroma feature
	quotedFrom: ActivityPubStatusItemDto.nullable().optional(),
});

export const appPostObjectSchema = ActivityPubStatusLevelTwo.extend({
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
export type AppPostObject = z.infer<typeof appPostObjectSchema>;

/**
 * Supports various operations on the
 * Status Interface
 */
export class AppStatusDtoService {
	/**
	 * list of instances found
	 * can belong to current/parent/boosted status
	 * and associated users
	 */
	ref: AppPostObject;

	constructor(ref: AppPostObject) {
		this.ref = ref;
	}

	static exportLocal(
		db: DataSource,
		input: AccountSavedPost,
		driver: KNOWN_SOFTWARE | string,
		server: string,
	) {
		if (!input) return null;

		const medias = input.medias || [];
		const height = MediaService.calculateHeightForLocalMediaCarousal(medias, {
			maxWidth: Dimensions.get('window').width - 32,
			maxHeight: MEDIA_CONTAINER_MAX_HEIGHT,
		});
		const user = input.savedUser;
		let handle =
			driver === KNOWN_SOFTWARE.BLUESKY
				? `@${user.username}`
				: ActivitypubHelper.getHandle(user.username, server);

		return {
			uuid: RandomUtil.nanoId(),
			id: input.identifier,
			visibility: 'N/A',
			createdAt: input.authoredAt,
			postedBy: {
				userId: user.identifier,
				avatarUrl: user.avatarUrl,
				displayName: user.displayName,
				handle: handle,
				instance: user.remoteServer,
			},
			content: {
				raw: input.textContent,
				media:
					medias?.map((o) => ({
						height: o.height,
						width: o.width,
						alt: o.alt,
						type: o.mimeType,
						url: o.url,
						previewUrl: o.previewUrl,
					})) || [],
			},
			stats: {
				replyCount: -1,
				boostCount: -1,
				likeCount: -1,
				reactions: [],
			},
			interaction: {
				bookmarked: false,
				boosted: false,
				liked: false,
			},
			calculated: {
				emojis: new Map([]),
				mediaContainerHeight: height,
				reactionEmojis: [],
			},
			meta: {
				sensitive: input.sensitive,
				cw: input.spoilerText,
				isBoost: false,
				isReply: false,
				mentions: [],
				cid: input.identifier,
				uri: input.identifier,
			},
			state: {
				isBookmarkStateFinal: true,
			},
		} as AppPostObject;
	}

	static export(
		input: StatusInterface,
		domain: string,
		subdomain: string,
	): z.infer<typeof ActivityPubStatusItemDto> {
		if (!input) return null;

		const medias = input?.getMediaAttachments();
		const height = MediaService.calculateHeightForMediaContentCarousal(medias, {
			maxWidth: Dimensions.get('window').width - 32,
			maxHeight: MEDIA_CONTAINER_MAX_HEIGHT,
		});

		const user = UserMiddleware.rawToInterface(input.getUser(), domain);
		let handle =
			domain === KNOWN_SOFTWARE.BLUESKY
				? `@${user.getUsername()}`
				: ActivitypubHelper.getHandle(
						input?.getAccountUrl(subdomain),
						subdomain,
					);

		const IS_BOOKMARK_RESOLVED = [
			KNOWN_SOFTWARE.MASTODON,
			KNOWN_SOFTWARE.PLEROMA,
			KNOWN_SOFTWARE.AKKOMA,
		].includes(domain as any);

		return {
			uuid: RandomUtil.nanoId(),
			id: input.getId(),
			visibility: input.getVisibility(),
			createdAt: input.getCreatedAt(),
			postedBy: {
				userId: user.getId(),
				avatarUrl: user.getAvatarUrl(),
				displayName: user.getDisplayName(),
				handle: handle,
				instance: user.getInstanceUrl() || subdomain,
			},
			content: {
				raw: input.getContent(),
				media:
					medias?.map((o) => ({
						height: o.getHeight(),
						width: o.getWidth(),
						alt: o.getAltText(),
						blurhash: o.getBlurHash(),
						type: o.getType(),
						url: o.getUrl(),
						previewUrl: o.getPreviewUrl(),
					})) || [],
			},
			stats: {
				replyCount: input.getRepliesCount(),
				boostCount: input.getRepostsCount(),
				likeCount: input.getFavouritesCount(),
				reactions: input.getReactions(input.getMyReaction()),
			},
			interaction: {
				bookmarked: input.getIsBookmarked(),
				boosted: input.getIsRebloggedByMe(),
				liked: input.getIsFavourited(),
			},
			calculated: {
				emojis: new Map([
					// @ts-ignore-next-line
					...user.getEmojiMap(), // @ts-ignore-next-line
					...input.getCachedEmojis(),
				]),
				mediaContainerHeight: height,
				reactionEmojis: input.getReactionEmojis(),
			},
			meta: {
				sensitive: input.getIsSensitive(),
				cw: input.getSpoilerText(),
				isBoost: input.isReposted(),
				isReply: input.isReply(),
				mentions: input.getMentions().map((o) => ({
					id: o.id,
					handle: o.acct,
					url: o.url,
				})),
				cid: input.getCid(),
				uri: input.getUri(),
			},
			state: {
				isBookmarkStateFinal: IS_BOOKMARK_RESOLVED,
			},
			atProto: {
				viewer:
					domain === KNOWN_SOFTWARE.BLUESKY
						? (input as BlueskyStatusAdapter).getViewer()
						: undefined,
			},
		};
	}
}
