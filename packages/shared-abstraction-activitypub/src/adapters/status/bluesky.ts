import { MediaAttachmentInterface } from '../media-attachment/interface.js';
import {
	DhaagaJsMentionObject,
	Status,
	StatusInterface,
} from './_interface.js';
import {
	BlockedPost,
	NotFoundPost,
	PostView,
	ReasonRepost,
} from '@atproto/api/dist/client/types/app/bsky/feed/defs.js';
import { ProfileViewBasic } from '@atproto/api/dist/client/types/app/bsky/actor/defs.js';
import BlueskyMediaAttachmentAdapter from '../media-attachment/bluesky.js';

type BlueskyPostReply =
	| PostView
	| NotFoundPost
	| BlockedPost
	| { [k: string]: unknown; $type: string }
	| undefined;

type BlueskyPostReason =
	| ReasonRepost
	| { [p: string]: unknown; $type: string }
	| undefined;

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
	parent: BlueskyPostReply;
	reason: BlueskyPostReason;

	constructor({
		post,
		reply,
		reason,
	}: {
		post: PostView;
		reply: BlueskyPostReply;
		reason: BlueskyPostReason;
	}) {
		this.post = post;
		this.parent = reply;
		this.reason = reason;
	}

	getRaw = () => this.post;
	getId = () => this.post.cid;
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

	getRepliedStatusRaw(): Status {
		return null;
	}

	getContent = () => (this.post?.record as any)?.text;

	getUser() {
		if (this.isReposted()) return this.reason!.by as ProfileViewBasic;
		return this.post.author;
	}

	isReposted = () => this.reason?.$type === 'app.bsky.feed.defs#reasonRepost';

	getMediaAttachments(): MediaAttachmentInterface[] | null | undefined {
		this.post.auth;
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

	isReply = () => !!this.parent;

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
