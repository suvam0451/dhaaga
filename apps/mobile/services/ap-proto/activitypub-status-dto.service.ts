import { z } from 'zod';
import {
	ActivitypubHelper,
	StatusInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import { ActivitypubStatusService } from './activitypub-status.service';
import ActivitypubAdapterService from '../activitypub-adapter.service';
import MediaService from '../media.service';
import { Dimensions } from 'react-native';
import { MEDIA_CONTAINER_MAX_HEIGHT } from '../../components/common/media/_common';

export const ActivityPubBoostedByDto = z.object({
	userId: z.string(),
	avatarUrl: z.string(),
	displayName: z.string().nullable().optional(),
	handle: z.string().regex(/^@.*?@?.*?$/),
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
		raw: z.string().nullable(),
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
		reactions: z.array(
			z.object({
				id: z.string(),
				count: z.number().positive(),
			}),
		),
	}),
	calculated: z.object({
		mediaContainerHeight: z.number(),
		emojis: z.map(
			z.string(),
			z.object({
				url: z.string(),
			}),
		),
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
});

export type ActivityPubStatusAppDtoType = z.infer<
	typeof ActivityPubStatusLevelThree
>;

/**
 * Supports various operations on the
 * Status Interface
 */
export class ActivitypubStatusDtoService {
	/**
	 * list of instances found
	 * can belong to current/parent/boosted status
	 * and associated users
	 */
	ref: ActivityPubStatusAppDtoType;

	constructor(ref: ActivityPubStatusAppDtoType) {
		this.ref = ref;
	}

	/**
	 * Process multiple status interfaces
	 * into app compatible status DTOs
	 * @param posts
	 * @param domain
	 * @param subdomain
	 */
	static exportMultiple(
		posts: StatusInterface[],
		domain: string,
		subdomain: string,
	) {
		const leanDtoItems = posts.map((o) =>
			ActivitypubStatusService.factory(o, domain, subdomain).export(),
		);
		return leanDtoItems.filter((o) => o !== null && o !== undefined);
	}

	static export(
		input: StatusInterface,
		domain: string,
		subdomain: string,
	): z.infer<typeof ActivityPubStatusItemDto> {
		if (!input) return null;

		const mediaAttachments = input?.getMediaAttachments();
		const height = MediaService.calculateHeightForMediaContentCarousal(
			mediaAttachments,
			{
				deviceWidth: Dimensions.get('window').width - 32,
				maxHeight: MEDIA_CONTAINER_MAX_HEIGHT,
			},
		);

		const user = ActivitypubAdapterService.adaptUser(input.getUser(), domain);
		const handle = ActivitypubHelper.getHandle(
			input?.getAccountUrl(subdomain),
			subdomain,
		);

		return {
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
					mediaAttachments?.map((o) => ({
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
				reactions: input.getReactions(),
			},
			interaction: {
				bookmarked: input.getIsBookmarked(),
				boosted: false,
				liked: false,
			},
			calculated: {
				emojis: user.getEmojiMap(),
				mediaContainerHeight: height,
				reactionEmojis: input.getReactionEmojis(),
			},
			meta: {
				sensitive: input.getIsSensitive(),
				cw: input.getSpoilerText(),
				isBoost: input.isReposted(),
				isReply: input.isReply(),
			},
		};
	}
}
