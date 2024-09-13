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
import BlueskyMediaAttachmentAdapter from '../media-attachment/bluesky.js';
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

	hasQuoteAvailable(): boolean {
		return !!(
			this.post.embed &&
			this.post.embed['type'] === 'app.bsky.embed.record#view'
		);
	}

	getQuoteRaw(): PostView | null | undefined {
		return this.post.embed!.record as PostView;
	}

	getRaw = () => this.post;
	getId = () => this.post?.cid;
	getUsername = () => this.post?.author?.handle;
	getDisplayName = () => this.post?.author?.displayName;
	getAvatarUrl = () => this.post?.author?.avatar;
	getCreatedAt = () =>
		(this.post.record as any)?.createdAt || this.post.indexedAt;

	getVisibility() {
		return 'public';
		// if (this.ref.post?.record) throw new Error('Method not implemented.');
	}

	getAccountUrl(mySubdomain?: string | undefined): string | null | undefined {
		// console.log('[INFO]: my subdomain', mySubdomain);
		// NOTE: something like this
		return `https://bsky.app/profile/${this.post?.author?.handle}`;
	}

	getRepostedStatus(): StatusInterface | null | undefined {
		// if (this.reason.reply) {
		// 	// TODO: type checking required
		// 	// typeof this.parent === PostView
		// 	return new BlueskyStatusAdapter(this.parent);
		// }
		return null;
	}

	getRepostedStatusRaw(): Status {
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
	getContent = () =>
		(this.post?.record as any)?.text || (this.post?.value as any)?.text;

	getUser() {
		if (this.isReposted()) return this.reason!.by as ProfileViewBasic;
		return this.post.author;
	}

	isReposted = () => this.reason?.$type === 'app.bsky.feed.defs#reasonRepost';

	getMediaAttachments(): MediaAttachmentInterface[] {
		const target: any[] = this.post?.embed?.images as any[];
		if (target)
			return target.map((o) => BlueskyMediaAttachmentAdapter.create(o));
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

	getIsRebloggedByMe(): boolean | null | undefined {
		throw new Error('Method not implemented.');
	}

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
