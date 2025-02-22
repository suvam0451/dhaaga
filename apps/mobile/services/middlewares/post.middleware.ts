import {
	ActivitypubHelper,
	ActivitypubStatusAdapter,
	StatusInterface,
} from '@dhaaga/bridge';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { AccountSavedPost } from '@dhaaga/db';
import MediaService from '../media.service';
import { Dimensions } from 'react-native';
import { MEDIA_CONTAINER_MAX_HEIGHT } from '../../components/common/media/_common';
import { TextParser, RandomUtil, postObjectSchema } from '@dhaaga/core';
import type { PostObjectType } from '@dhaaga/core';

/**
 * converts unified interfaces into
 * light-weight JSON objects, to be
 * consumed by the app
 *
 * This middleware deals with post
 * objects. Also see other files
 * in this folder
 */
class PostMiddleware {
	static exportLocal(
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
				id: user.identifier,
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
				mentions: TextParser.findMentions(input.textContent),
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
		} as PostObjectType;
	}

	/**
	 * Converts a savedPost (post saved locally
	 * on the database) to in-app dto object
	 *
	 * Notably, no need to look for
	 * shares/parents/root/quotes/embeds
	 * @param db
	 * @param input
	 * @param driver
	 * @param server
	 */
	static databaseToJson(
		input: AccountSavedPost,
		{
			driver,
			server,
		}: {
			driver: KNOWN_SOFTWARE | string;
			server: string;
		},
	): PostObjectType {
		const parsed = PostMiddleware.exportLocal(input, driver, server);

		const { data, error, success } = postObjectSchema.safeParse(parsed);
		if (!success) {
			console.log('[ERROR]: failed to convert local savedPost', error);
			console.log('[INFO]: input used', input);
			return null;
		}
		return data as PostObjectType;
	}

	/**
	 * Deserializes (skips returning the interface step)
	 * locally saved ap/at proto post objects
	 * @param input raw ap/at proto post object
	 * @param driver being used to deserialize this object
	 * @param server
	 */
	private static deserializeLocal<T>(
		input: T | T[],
		driver: string | KNOWN_SOFTWARE,
		server: string,
	): T extends unknown[] ? PostObjectType[] : PostObjectType {
		if (input instanceof Array) {
			return input
				.map((o) =>
					PostMiddleware.databaseToJson(o as AccountSavedPost, {
						driver,
						server,
					}),
				)
				.filter((o) => !!o) as unknown as T extends unknown[]
				? PostObjectType[]
				: never;
		} else {
			try {
				if (!input) return null;
				return PostMiddleware.databaseToJson(input as AccountSavedPost, {
					driver,
					server,
				}) as unknown as T extends unknown[] ? never : PostObjectType;
			} catch (e) {
				console.log(
					'[ERROR]: failed to deserialize local post object',
					e,
					'input:',
					input,
				);
				return null;
			}
		}
	}

	/**
	 * Since the share item itself
	 * is a protocol object, the underlying
	 * post target with the actual content needs to
	 * be extracted out
	 * @param input post object, possibly the original
	 * root level object
	 *
	 *  - Shares -> Returns boostedFrom
	 *  - Quotes -> Returns the object itself
	 */
	static getContentTarget(input: PostObjectType): PostObjectType {
		if (!input) {
			console.log('[WARN]: trying to obtain target post for', input);
			return input;
		}
		if (input.meta.isBoost && !input.boostedFrom) {
			console.log('[WARN]: original object not available for a repost', input);
			return input;
		}
		return input.meta.isBoost
			? input.content.raw || input.content.media.length > 0
				? input
				: input.boostedFrom
			: input;
	}
}

export { PostMiddleware };
