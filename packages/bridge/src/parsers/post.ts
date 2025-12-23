import { z } from 'zod';
import { UserParser } from './user.js';
import { TextNodeParser } from './text-nodes.js';
import { DriverService } from '../services/driver.js';
import { RandomUtil } from '../utils/index.js';
import { ActivitypubStatusAdapter } from '../implementors/status/_adapters.js';
import { PostTargetInterface } from '../implementors/index.js';
import { KNOWN_SOFTWARE } from '../client/utils/driver.js';
import AtprotoPostAdapter from '../implementors/status/bluesky.js';
import { ActivitypubHelper } from '../index.js';
import {
	ActivityPubStatusItemDto,
	postObjectSchema,
	PostObjectType,
} from '#/types/shared/post.js';

/**
 * The Parser class provides a set of static methods to handle tasks such as
 * converting raw data into structured objects, serializing/deserializing
 * data for various protocols, and parsing API responses.
 */
class Parser {
	/**
	 * This is the actual internal parser
	 * implementation. It converts an interface
	 * to a post-object.
	 *
	 * @param input
	 * @param domain
	 * @param subdomain
	 * @private
	 */
	private static _export(
		input: PostTargetInterface,
		domain: string,
		subdomain: string,
	): PostObjectType | null {
		if (!input) return null;

		const IS_BOOKMARK_RESOLVED = DriverService.supportsMastoApiV1(domain);
		const IS_ATPROTO = DriverService.supportsAtProto(domain);

		const medias = input?.getMediaAttachments();
		// const height = MediaService.calculateHeightForMediaContentCarousal(medias, {
		// 	maxWidth: Dimensions.get('window').width - 32,
		// 	maxHeight: MEDIA_CONTAINER_MAX_HEIGHT,
		// });

		const user = UserParser.rawToInterface<unknown>(input.getUser(), domain);
		let handle = IS_ATPROTO
			? `@${user.getUsername()}`
			: ActivitypubHelper.getHandle(
					input.getAccountUrl(subdomain) || '',
					subdomain,
				);

		const parsedContent = TextNodeParser.parse(
			domain,
			input.getContent() || '',
			input.getFacets(),
		);
		const parsedDisplayName = IS_ATPROTO
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
			: TextNodeParser.parse(
					domain,
					input.getDisplayName() || '',
					input.getFacets(),
				);

		return {
			uuid: input.getId(),
			id: input.getId(),
			visibility: input.getVisibility(),
			createdAt: input.getCreatedAt(),
			postedBy: {
				id: user.getId(),
				avatarUrl: user.getAvatarUrl() || '',
				displayName: user.getDisplayName(),
				parsedDisplayName: parsedDisplayName || [],
				handle: handle,
				instance: user.getInstanceUrl() || subdomain,
			},
			content: {
				raw: input.getContent(),
				parsed: parsedContent || [],
				media:
					medias.map((o) => ({
						height: o.getHeight(),
						width: o.getWidth(),
						alt: o.getAltText() || null,
						blurhash: o.getBlurHash() || null,
						type: o.getType(),
						url: o.getUrl()!,
						previewUrl: o.getPreviewUrl(),
					})) || [],
				links: input.getLinkAttachments(),
			},
			stats: {
				replyCount: input.getRepliesCount(),
				boostCount: input.getRepostsCount(),
				likeCount: input.getFavouritesCount(),
				quoteCount: input.getQuotesCount(),
				reactions: input.getReactions(input.getMyReaction() || ''),
			},
			interaction: {
				bookmarked: input.getIsBookmarked() || false,
				boosted: input.getIsRebloggedByMe() || false,
				liked: input.getIsFavourited() || false,
			},
			calculated: {
				emojis: new Map([...user.getEmojiMap(), ...input.getCachedEmojis()]),
				mediaContainerHeight: 0, // height,
				reactionEmojis: input.getReactionEmojis(),
				// mentions: TextParser.findMentions(input.getContent() || ''),
				mentions: input.getMentions(),
			},
			meta: {
				sensitive: input.getIsSensitive(),
				cw: input.getSpoilerText() || null,
				isBoost: input.isReposted(),
				isQuote: input.isReposted(),
				isReply: input.isReply(),
				mentions: input.getMentions(),
				cid: input.getCid(),
				uri: input.getUri(),
			},
			state: {
				isBookmarkStateFinal: IS_BOOKMARK_RESOLVED,
			},
			atProto: {
				viewer: DriverService.supportsAtProto(domain)
					? (input as AtprotoPostAdapter).getViewer()
					: undefined,
			},
		};
	}

	static rawToInterface<T>(
		input: T | T[],
		driver: string | KNOWN_SOFTWARE,
	): T extends unknown[] ? PostTargetInterface[] : PostTargetInterface {
		if (Array.isArray(input)) {
			return input
				.filter((o) => !!o)
				.map((o) =>
					ActivitypubStatusAdapter(o, driver),
				) as unknown as T extends unknown[] ? PostTargetInterface[] : never;
		} else {
			return ActivitypubStatusAdapter(
				input,
				driver,
			) as unknown as T extends unknown[] ? never : PostTargetInterface;
		}
	}

	/**
	 * converts an interface to a post object
	 *
	 * PostTargetInterface -> PostObjectType
	 * @param input
	 * @param driver
	 * @param server
	 */
	static interfaceToJson(
		input: PostTargetInterface,
		{
			driver,
			server,
		}: {
			driver: KNOWN_SOFTWARE | string;
			server: string;
		},
	): PostObjectType | null {
		// prevent infinite recursion
		if (!input) return null;

		const IS_SHARE = input.isReposted();
		const HAS_PARENT = input.isReply();
		const HAS_ROOT = input.hasRootAvailable();

		let sharedFrom: z.infer<typeof ActivityPubStatusItemDto> | null = IS_SHARE
			? Parser.parse(input.getRepostedStatusRaw(), driver, server)
			: null;
		if (
			input.getUri() ===
				'at://did:plc:iqk7tmzyrrczk7rnhqds63l3/app.bsky.feed.post/3m47nor6wqk26' ||
			input.getUri() ===
				'at://did:plc:c5rh46ed6kpelxloeaycpsb7/app.bsky.feed.post/3m2tpa67rn22n'
		) {
			console.log('shared from', sharedFrom);
		}

		// Null for Mastodon
		let replyTo: z.infer<typeof ActivityPubStatusItemDto> | null = HAS_PARENT
			? Parser.parse(input.getParentRaw(), driver, server)
			: null;

		let root: z.infer<typeof ActivityPubStatusItemDto> | null = HAS_ROOT
			? Parser.parse(input.getRootRaw(), driver, server)
			: null;

		const dto: PostObjectType =
			HAS_PARENT &&
			(DriverService.supportsAtProto(driver) ||
				DriverService.supportsMisskeyApi(driver))
				? /**
					 * 	Replies in Misskey is actually present in the
					 * 	"reply" object, instead of root. へんですね?
					 */
					{
						...Parser._export(input, driver, server)!,
						boostedFrom: sharedFrom,
						replyTo,
						rootPost: root,
					}
				: {
						...Parser._export(input, driver, server)!,
						boostedFrom: sharedFrom,
					};

		const { data, error, success } = postObjectSchema.safeParse(dto);
		if (!success) {
			// not expected to parse
			console.log(input.getRaw() as any);
			if (
				(input.getRaw() as any)?.$type === 'app.bsky.embed.record#viewNotFound'
			)
				return null;

			console.log('[ERROR]: status item dto validation failed', error, dto.id);
			// console.log('[INFO]: generated object', dto);
			input.print();
			return null;
		}
		return data as PostObjectType;
	}

	/**
	 * Deserializes (skips returning the interface step)
	 * raw ap/at proto post objects
	 * @param input raw ap/at proto post object
	 * @param driver being used to deserialize this object
	 * @param server
	 */
	static parse<T>(
		input: T | T[],
		driver: string | KNOWN_SOFTWARE,
		server: string,
	): T extends unknown[] ? PostObjectType[] : PostObjectType | null {
		if (input instanceof Array) {
			return input
				.map((o) => Parser.rawToInterface<unknown>(o, driver))
				.filter((o) => !!o)
				.map((o) =>
					Parser.interfaceToJson(o, {
						driver,
						server,
					}),
				)
				.filter((o) => !!o) as unknown as T extends unknown[]
				? PostObjectType[]
				: never;
		} else {
			try {
				if (!input)
					return null as unknown as T extends unknown[] ? never : null;
				return Parser.interfaceToJson(
					Parser.rawToInterface<unknown>(input, driver),
					{
						driver,
						server,
					},
				) as unknown as T extends unknown[] ? never : PostObjectType;
			} catch (e) {
				console.log(
					'[ERROR]: failed to deserialize post object',
					e,
					'input:',
					input,
					driver,
					server,
				);
				return null as unknown as T extends unknown[] ? never : null;
			}
		}
	}
}

class Inspector {
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
			console.log(
				'[WARN]: original object not available for a repost',
				input.id,
			);
			// FIX: avoid trying to force render the boostedFrom object
			return {
				...input,
				meta: {
					...input.meta,
					isBoost: false,
				},
			};
		}
		return input.meta.isBoost
			? input.content.raw || input.content.media.length > 0
				? input
				: input.boostedFrom!
			: input;
	}

	/**
	 * ------ Utility functions follow ------
	 */

	static isQuoteObject(input: PostObjectType) {
		return (
			input?.meta?.isBoost &&
			(input?.content?.raw || input?.content?.media?.length > 0)
		);
	}

	static isLiked(input: PostObjectType) {
		if (!input) return false;
		return !!input.atProto?.viewer?.like || input.interaction.liked;
	}

	static isShared(input: PostObjectType) {
		if (!input) return false;
		return !!input.atProto?.viewer?.repost || input.interaction.boosted;
	}

	static isBookmarked(input: PostObjectType) {
		const _target = Inspector.getContentTarget(input);
		return _target.interaction.bookmarked;
	}
}

export { Parser as PostParser, Inspector as PostInspector };
