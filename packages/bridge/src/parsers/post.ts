import { z } from 'zod';
import { UserParser } from './user.js';
import { TextNodeParser } from './text-nodes.js';
import { DriverService } from '../services/driver.js';
import { ResultPage } from '../utils/pagination.js';
import { Err, Ok, RandomUtil } from '../utils/index.js';
import { ApiErrorCode } from '../types/result.types.js';
import { ApiResult } from '../utils/api-result.js';
import { ActivitypubStatusAdapter } from '../implementors/status/_adapters.js';
import { PostTargetInterface } from '../implementors/index.js';
import { KNOWN_SOFTWARE } from '../data/driver.js';
import AtprotoPostAdapter from '../implementors/status/bluesky.js';
import { ActivitypubHelper, DriverUserFindQueryType } from '../index.js';

const mentionObjectSchema = z.object({
	id: z.string(),
	handle: z.string().optional(),
	url: z.string().optional(),
	acct: z.string().optional().nullable(),
	username: z.string().optional().nullable(),
});

type PostMentionObjectType = z.infer<typeof mentionObjectSchema>;

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
const ActivityPubStatusItemDto = z.object({
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

/**
 * The Parser class provides a set of static methods to handle tasks such as
 * converting raw data into structured objects, serializing/deserializing
 * data for various protocols, and parsing API responses.
 */
class Parser {
	static export(
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
			uuid: RandomUtil.nanoId(),
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
			},
			stats: {
				replyCount: input.getRepliesCount(),
				boostCount: input.getRepostsCount(),
				likeCount: input.getFavouritesCount(),
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
						...Parser.export(input, driver, server)!,
						boostedFrom: sharedFrom,
						replyTo,
						rootPost: root,
					}
				: {
						...Parser.export(input, driver, server)!,
						boostedFrom: sharedFrom,
					};

		const { data, error, success } = postObjectSchema.safeParse(dto);
		if (!success) {
			console.log('[ERROR]: status item dto validation failed', error);
			console.log('[INFO]: generated object', dto);
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

	static parseApiResponse(
		input: any,
		driver: string | KNOWN_SOFTWARE,
		server: string,
	): ApiResult<ResultPage<PostObjectType>> {
		if (Array.isArray(input)) {
			return Ok({
				items: Parser.parse<unknown[]>(input, driver, server),
				maxId: null,
				minId: null,
				isLoaded: true,
			});
		}
		console.log('[WARN]: failed to identify shape of the input');
		return Err(ApiErrorCode.PARSING_FAILED);
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
			console.log('[WARN]: original object not available for a repost', input);
			return input;
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
}

class Resolver {
	static mentionItemsToWebfinger(
		handle: string,
		items: PostMentionObjectType[],
	): DriverUserFindQueryType | null {
		const parts = handle.split('@').filter(Boolean); // Remove empty elements after splitting
		if (parts.length === 1) {
			/**
			 * Mastodon has acct/url
			 */
			const match = items.find(
				(o) => o.acct?.startsWith(parts[0]) && o.url?.endsWith(parts[0]),
			);
			if (match) {
				return {
					use: 'userId',
					userId: match.id,
				};
			}
		}
		const match = items.find((o) => o.acct === `${parts[0]}@${parts[1]}`);
		if (match) {
			return {
				use: 'userId',
				userId: match.id,
			};
		}
		return null;
	}
}

export {
	Parser as PostParser,
	Inspector as PostInspector,
	Resolver as PostResolver,
	postObjectSchema,
};
export type {
	PostMentionObjectType,
	ActivityPubReactionStateType,
	PostObjectType,
	PostRootObjectType,
	PostAuthorType,
	PostMediaAttachmentType,
	PostStatsType,
};
