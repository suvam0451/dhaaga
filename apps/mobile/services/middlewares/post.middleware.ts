import {
	ActivitypubHelper,
	ActivitypubStatusAdapter,
	BlueskyStatusAdapter,
	StatusInterface,
	UserInterface,
} from '@dhaaga/bridge';
import {
	AppPostObject,
	ActivityPubStatusItemDto,
	appPostObjectSchema,
} from '../../types/app-post.types';
import { z } from 'zod';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { AccountSavedPost } from '../../database/_schema';
import ActivityPubService from '../activitypub.service';
import ActivitypubService from '../activitypub.service';
import MediaService from '../media.service';
import { Dimensions } from 'react-native';
import { MEDIA_CONTAINER_MAX_HEIGHT } from '../../components/common/media/_common';
import { UserMiddleware } from './user.middleware';
import { AtprotoService } from '../atproto.service';
import MfmService from '../mfm.service';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../utils/theming.util';
import { RandomUtil } from '../../utils/random.utils';
import { TextParserService } from '../text-parser.service';

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
	domain: string;
	subdomain: string;
	statusI: StatusInterface;
	userI: UserInterface;
	/**
	 * list of instances found
	 * can belong to current/parent/boosted status
	 * and associated users
	 */
	foundInstances: Set<string>;

	constructor(ref: StatusInterface, driver: string, server: string) {
		this.statusI = ref;
		this.domain = driver;
		this.subdomain = server;
		this.foundInstances = new Set();
		return this;
	}

	// Static method that returns an instance of MyClass
	static factory(ref: StatusInterface, domain?: string, subdomain?: string) {
		return new PostMiddleware(ref, domain, subdomain);
	}

	static export(
		input: StatusInterface,
		domain: string,
		subdomain: string,
	): AppPostObject {
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

		const emojiMap = new Map<string, string>([
			// @ts-ignore-next-line
			...user.getEmojiMap(), // @ts-ignore-next-line
			...input.getCachedEmojis(),
		]);

		const parsedContent = ActivityPubService.blueskyLike(domain)
			? AtprotoService.processTextContent(input.getContent(), input.getFacets())
			: MfmService.renderMfm(input.getContent(), {
					emojiMap,
					emphasis: APP_COLOR_PALETTE_EMPHASIS.A0,
					colorScheme: null,
					variant: 'bodyContent',
					nonInteractive: false,
				})?.parsed;
		const parsedDisplayName = ActivityPubService.blueskyLike(domain)
			? [
					{
						uuid: RandomUtil.nanoId(),
						type: 'para',
						nodes: [
							{
								uuid: RandomUtil.nanoId(),
								type: 'text',
								text: user.getDisplayName(),
							},
						],
					},
				]
			: MfmService.renderMfm(user.getDisplayName(), {
					emojiMap,
					emphasis: APP_COLOR_PALETTE_EMPHASIS.A0,
					colorScheme: null,
					variant: 'displayName',
					nonInteractive: false,
				})?.parsed;

		return {
			uuid: RandomUtil.nanoId(),
			id: input.getId(),
			visibility: input.getVisibility(),
			createdAt: input.getCreatedAt(),
			postedBy: {
				id: user.getId(),
				avatarUrl: user.getAvatarUrl(),
				displayName: user.getDisplayName(),
				parsedDisplayName: parsedDisplayName || [],
				handle: handle,
				instance: user.getInstanceUrl() || subdomain,
			},
			content: {
				raw: input.getContent(),
				parsed: parsedContent || [],
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
				mentions: TextParserService.findMentions(input.getContent()),
			},
			meta: {
				sensitive: input.getIsSensitive(),
				cw: input.getSpoilerText(),
				isBoost: input.isReposted(),
				isReply: input.isReply(),
				mentions: input.getMentions().map((o) => ({
					id: o.id,
					// handle: o.acct,
					url: o.url,
					username: o.username,
					acct: o.acct,
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
		} as AppPostObject;
	}

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
				mentions: TextParserService.findMentions(input.textContent),
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
	): AppPostObject {
		const parsed = PostMiddleware.exportLocal(input, driver, server);

		const { data, error, success } = appPostObjectSchema.safeParse(parsed);
		if (!success) {
			console.log('[ERROR]: failed to convert local savedPost', error);
			console.log('[INFO]: input used', input);
			return null;
		}
		return data as AppPostObject;
	}

	static interfaceToJson(
		input: StatusInterface,
		{
			driver,
			server,
		}: {
			driver: KNOWN_SOFTWARE | string;
			server: string;
		},
	): AppPostObject {
		// prevent infinite recursion
		if (!input) return null;

		const IS_SHARE = input.isReposted();
		const HAS_PARENT = input.isReply();
		const HAS_ROOT = input.hasRootAvailable();

		let sharedFrom: z.infer<typeof ActivityPubStatusItemDto> = IS_SHARE
			? PostMiddleware.deserialize(input.getRepostedStatusRaw(), driver, server)
			: null;

		// Null for Mastodon
		let replyTo: z.infer<typeof ActivityPubStatusItemDto> = HAS_PARENT
			? PostMiddleware.deserialize(input.getParentRaw(), driver, server)
			: null;

		let root: z.infer<typeof ActivityPubStatusItemDto> = HAS_ROOT
			? PostMiddleware.deserialize(input.getRootRaw(), driver, server)
			: null;

		const dto: AppPostObject =
			HAS_PARENT &&
			(ActivityPubService.blueskyLike(driver) ||
				ActivitypubService.misskeyLike(driver))
				? /**
					 * 	Replies in Misskey is actually present in the
					 * 	"reply" object, instead of root. へんですね?
					 */
					{
						...PostMiddleware.export(input, driver, server),
						boostedFrom: sharedFrom,
						replyTo,
						rootPost: root,
					}
				: {
						...PostMiddleware.export(input, driver, server),
						boostedFrom: sharedFrom,
					};

		const { data, error, success } = appPostObjectSchema.safeParse(dto);
		if (!success) {
			console.log('[ERROR]: status item dto validation failed', error);
			console.log('[INFO]: generated object', dto);
			input.print();
			return null;
		}
		return data as AppPostObject;
	}

	static rawToInterface<T>(
		input: T | T[],
		driver: string | KNOWN_SOFTWARE,
	): T extends unknown[] ? StatusInterface[] : StatusInterface {
		if (Array.isArray(input)) {
			return input
				.filter((o) => !!o)
				.map((o) =>
					ActivitypubStatusAdapter(o, driver),
				) as unknown as T extends unknown[] ? StatusInterface[] : never;
		} else {
			return ActivitypubStatusAdapter(
				input,
				driver,
			) as unknown as T extends unknown[] ? never : StatusInterface;
		}
	}

	/**
	 * Deserializes (skips returning the interface step)
	 * raw ap/at proto post objects
	 * @param input raw ap/at proto post object
	 * @param driver being used to deserialize this object
	 * @param server
	 */
	static deserialize<T>(
		input: T | T[],
		driver: string | KNOWN_SOFTWARE,
		server: string,
	): T extends unknown[] ? AppPostObject[] : AppPostObject {
		if (input instanceof Array) {
			return input
				.map((o) => PostMiddleware.rawToInterface<unknown>(o, driver))
				.filter((o) => !!o)
				.map((o) =>
					PostMiddleware.interfaceToJson(o, {
						driver,
						server,
					}),
				)
				.filter((o) => !!o) as unknown as T extends unknown[]
				? AppPostObject[]
				: never;
		} else {
			try {
				if (!input) return null;
				return PostMiddleware.interfaceToJson(
					PostMiddleware.rawToInterface<unknown>(input, driver),
					{
						driver,
						server,
					},
				) as unknown as T extends unknown[] ? never : AppPostObject;
			} catch (e) {
				console.log(
					'[ERROR]: failed to deserialize post object',
					e,
					'input:',
					input,
				);
				return null;
			}
		}
	}

	/**
	 * Deserializes (skips returning the interface step)
	 * locally saved ap/at proto post objects
	 * @param input raw ap/at proto post object
	 * @param driver being used to deserialize this object
	 * @param server
	 */
	static deserializeLocal<T>(
		input: T | T[],
		driver: string | KNOWN_SOFTWARE,
		server: string,
	): T extends unknown[] ? AppPostObject[] : AppPostObject {
		if (input instanceof Array) {
			return input
				.map((o) =>
					PostMiddleware.databaseToJson(o as AccountSavedPost, {
						driver,
						server,
					}),
				)
				.filter((o) => !!o) as unknown as T extends unknown[]
				? AppPostObject[]
				: never;
		} else {
			try {
				if (!input) return null;
				return PostMiddleware.databaseToJson(input as AccountSavedPost, {
					driver,
					server,
				}) as unknown as T extends unknown[] ? never : AppPostObject;
			} catch (e) {
				console.log(
					'[ERROR]: failed to deserialize post object',
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
	static getContentTarget(input: AppPostObject): AppPostObject {
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

	/**
	 * ------ Utility functions follow ------
	 */

	static isQuoteObject(input: AppPostObject) {
		return (
			input?.meta?.isBoost &&
			(input?.content?.raw || input?.content?.media?.length > 0)
		);
	}

	static isLiked(input: AppPostObject) {
		if (!input) return false;
		return !!input.atProto?.viewer?.like || input.interaction.liked;
	}

	static isShared(input: AppPostObject) {
		if (!input) return false;
		return !!input.atProto?.viewer?.repost || input.interaction.boosted;
	}
}

export { PostMiddleware };
