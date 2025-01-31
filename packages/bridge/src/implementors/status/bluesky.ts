import { MediaAttachmentInterface } from '../media-attachment/interface.js';
import {
	DhaagaJsMentionObject,
	Status,
	StatusInterface,
} from './_interface.js';
import {
	PostView,
	ReasonRepost,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs.js';
import { ProfileViewBasic } from '@atproto/api/dist/client/types/app/bsky/actor/defs.js';
import {
	EmbedViewProcessor_External,
	EmbedViewProcessor_Images,
	EmbedViewProcessor_RecordWithMedia,
	EmbedViewProcessor_Video,
} from '../media-attachment/bluesky.js';
import { ReplyRef } from '@atproto/api/src/client/types/app/bsky/feed/defs.js';

type BlueskyRichTextFacet = {
	$type?: 'app.bsky.richtext.facet';
	features: {
		$type:
			| 'app.bsky.richtext.facet#mention'
			| 'app.bsky.richtext.facet#tag'
			| string;
		tag?: string;
		did?: string;
	}[];
	index: {
		byteEnd: number;
		byteStart: number;
	};
};

class BlueskyStatusAdapter implements StatusInterface {
	post: PostView;
	reply: ReplyRef;
	reason: ReasonRepost;

	constructor({
		post,
		reply,
		reason,
	}: {
		post: PostView;
		reply: ReplyRef;
		reason: ReasonRepost;
	}) {
		this.post = post;
		this.reply = reply;
		this.reason = reason;
	}

	getCid = () => this.post.cid;
	getUri = () => this.post.uri;

	getLikeUri = () => this.post.viewer?.like;
	getEmbeddingDisabled = () => this.post.viewer?.embeddingDisabled;
	getPinUri = () => this.post.viewer?.pinned;
	getRepostUri = () => this.post.viewer?.repost;
	getReplyDisabled = () => this.post.viewer?.replyDisabled;
	getThreadMuted = () => this.post.viewer?.threadMuted;

	getViewer = () => this.post.viewer;

	hasQuoteAvailable(): boolean {
		return !!(this.post.embed && this.isQuote());
	}

	getQuoteRaw(): PostView | null | undefined {
		return this.post.embed!.record as PostView;
	}

	getRaw = () => this.post;
	getId = () => this.post?.uri;
	getUsername = () => this.post?.author?.handle;
	getDisplayName = () => this.post?.author?.displayName;
	getAvatarUrl = () => this.post?.author?.avatar;
	getCreatedAt = () => {
		if (this.isShare()) return this.reason?.indexedAt;
		// for original posts (or quotes)
		return (this.post.record as any)?.createdAt || this.post.indexedAt;
	};

	getVisibility() {
		return 'public';
		// if (this.ref.post?.record) throw new Error('Method not implemented.');
	}

	getAccountUrl(mySubdomain?: string | undefined): string | null | undefined {
		return `https://bsky.app/profile/${this.post?.author?.handle}`;
	}

	getRepostedStatus(): StatusInterface | null | undefined {
		if (this.isShare()) {
			const { post, ...rest } = this;
			/**
			 * by stripping reason, we avoid recursive call
			 * + replies are not needed for reposts
			 */
			return new BlueskyStatusAdapter({
				post: this.post,
				reason: null as any,
				reply: null as any,
			});
		} else if (this.isQuote()) {
			if (this.post.embed?.$type === 'app.bsky.embed.recordWithMedia#view') {
				return new BlueskyStatusAdapter({
					post: (this.post.embed as any)?.record?.record as any,
					reason: null as any,
					reply: null as any,
				});
			} else {
				return new BlueskyStatusAdapter({
					post: this.post.embed?.record as any,
					reason: null as any,
					reply: null as any,
				});
			}
		}
		// if (this.reason.reply) {
		// 	// TODO: type checking required
		// 	// typeof this.parent === PostView
		// 	return new BlueskyStatusAdapter(this.parent);
		// }
		return null;
	}

	getRepostedStatusRaw(): Status {
		if (this.isShare()) {
			/**
			 * by stripping reason/reply, we avoid recursive call
			 *
			 * DOWNSIDES: reply is not shown for reposted object
			 */
			const { post, ...rest } = this;
			// strip repost/reply information
			return { post } as any;
		}
		if (this.isQuote()) {
			switch ((this.post.embed as any)?.$type) {
				case 'app.bsky.embed.recordWithMedia#view': {
					// also has record?.media object
					return { post: (this.post.embed?.record as any)?.record } as any;
				}
				case 'app.bsky.embed.record#view': {
					return { post: this.post.embed?.record } as any;
				}
				default:
					return null;
			}
		}
		return null;
	}

	hasParentAvailable = () => !!this.reply?.parent;
	getParentRaw = () => this.reply?.parent as PostView;
	hasRootAvailable = () => !!this.reply?.root;
	getRootRaw = () => this.reply?.root as PostView;

	/**
	 * record is used for app.bsky.feed.defs#postView
	 * value is used for app.bsky.embed.record#viewRecord
	 *
	 * ^ a.k.a. quoted posts
	 */
	getContent() {
		// handle pure reposts
		if (this.isShare()) return null;

		// TODO: handle quotes
		return (this.post?.record as any)?.text || (this.post?.value as any)?.text;
	}

	getFacets() {
		// handle pure reposts
		if (this.isShare()) return [];

		// TODO: handle quotes
		return (this.post?.record as any)?.facets || [];
	}

	getUser() {
		if (this.isShare()) return this.reason!.by as ProfileViewBasic;
		return this.post.author;
	}

	isQuote = () =>
		this.post.embed?.$type === 'app.bsky.embed.record#view' ||
		this.post.embed?.$type === 'app.bsky.embed.recordWithMedia#view';
	isShare = () => this.reason?.$type === 'app.bsky.feed.defs#reasonRepost';

	isReposted = () => this.isShare() || this.isQuote();

	getMediaAttachments(): MediaAttachmentInterface[] {
		// it seemed that some quotes can be made with image embed...
		if ((this.reason as any)?.$type === 'app.bsky.feed.defs#reasonRepost') {
			return [];
		}

		// tenor etc.
		if (EmbedViewProcessor_External.isCompatible(this.post.embed))
			return EmbedViewProcessor_External.compile(this.post.embed as any);

		if (EmbedViewProcessor_RecordWithMedia.isCompatible(this.post.embed))
			return EmbedViewProcessor_RecordWithMedia.compile(this.post.embed);

		if (this.post.$type === 'app.bsky.embed.record#viewRecord') {
			// this handles an original post attached to a quote post
			const embeds = this.post.embeds as any;

			if (embeds && Array.isArray(embeds)) {
				const attachments = [];

				for (const embed of embeds) {
					if (EmbedViewProcessor_Images.isCompatible(embed))
						attachments.push(...EmbedViewProcessor_Images.compile(embed));

					if (EmbedViewProcessor_Video.isCompatible(embed))
						attachments.push(...EmbedViewProcessor_Video.compile(embed));
				}
				return attachments;
			}
		} else if (
			// FIXME: how to extract images for quote posts
			(this.reason as any)?.$type === 'app.bsky.feed.defs#reasonRepost'
		) {
			return [];
		}

		if (EmbedViewProcessor_Images.isCompatible(this.post.embed))
			return EmbedViewProcessor_Images.compile(this.post.embed as any);

		if (EmbedViewProcessor_Video.isCompatible(this.post.embed))
			return EmbedViewProcessor_Video.compile(this.post.embed as any);

		return [];
	}

	getMentions(): DhaagaJsMentionObject[] {
		const facets: BlueskyRichTextFacet[] = (this.post?.record as any)?.facets;
		if (facets) {
			facets
				.filter((o) =>
					o.features
						.map((o) => o.$type)
						.includes('app.bsky.richtext.facet#mention'),
				)
				.map((o) => ({ id: o.features[0].did }));
		}
		return [];
	}

	print(): void {
		console.log(this.post);
	}

	getIsRebloggedByMe = () => this.post.viewer?.repost !== undefined;

	getIsFavourited = () => false;

	// Meta
	getRepostsCount = () => this.post?.repostCount || 0;
	getRepliesCount = () => this.post?.replyCount || 0;
	getFavouritesCount = () => this.post?.likeCount || 0;
	// TODO: not implemented by interface
	getQuoteCount = () => this.post?.quoteCount || 0;

	getAccountId_Poster(): string {
		throw new Error('Method not implemented.');
	}

	isValid = () => true;

	isReply = () => !!this.reply;

	getParentStatusId(): string | null | undefined {
		return null;
	}

	getUserIdParentStatusUserId(): string | null | undefined {
		return null;
	}

	getIsSensitive = () => false;

	getSpoilerText = () => null;

	setDescendents = (items: StatusInterface[]) => [];
	getDescendants = () => [];

	// Unsupported by Bluesky

	// Reactions
	getReactions = () => [];
	getCachedEmojis = () => new Map<string, string>();
	getReactionEmojis = () => [];
	getMyReaction = () => null;

	// Quotes???
	getQuote = () => null;

	// Bookmarks
	getIsBookmarked = () => false;
}

export default BlueskyStatusAdapter;
