import { MediaAttachmentTargetInterface } from '../media-attachment/_interface.js';
import { DhaagaJsMentionObject, PostTargetInterface } from './_interface.js';
import {
	EmbedViewProcessor_External_2,
	EmbedViewProcessor_ImagesView,
	EmbedViewProcessor_RecordWithMedia,
	EmbedViewProcessor_Video,
	LinkEmbedProcessor_External,
} from '../media-attachment/bluesky.js';
import {
	AppBskyEmbedRecord,
	AppBskyEmbedRecordWithMedia,
	AppBskyFeedDefs,
	AppBskyRichtextFacet,
} from '@atproto/api';
import { PostLinkAttachmentObjectType } from '#/types/shared/link-attachments.js';

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

class AtprotoPostAdapter implements PostTargetInterface {
	post: AppBskyFeedDefs.PostView; // PostView;
	reply: any; // ReplyRef
	reason: any; // ReasonRepost

	constructor({
		post,
		reply,
		reason,
	}: {
		post: any; // PostView;
		reply: any; // ReplyRef
		reason: any; // ReasonRepost
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
		return this.isQuote();
	}

	getQuoteRaw(): null | undefined {
		return (this.post.embed as any)!.record;
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

	getRepostedStatus(): PostTargetInterface | null | undefined {
		if (this.isShare()) {
			const { post, ...rest } = this;
			/**
			 * by stripping reason, we avoid recursive call
			 * + replies are not needed for reposts
			 */
			return new AtprotoPostAdapter({
				post: this.post,
				reason: null as any,
				reply: null as any,
			});
		} else if (this.isQuote()) {
			if (this.post.embed?.$type === 'app.bsky.embed.recordWithMedia#view') {
				const _embed = this.post.embed as AppBskyEmbedRecordWithMedia.View;
				return new AtprotoPostAdapter({
					post: _embed.record.record,
					reason: null as any,
					reply: null as any,
				});
			} else {
				return new AtprotoPostAdapter({
					post: (this.post.embed as any)?.record,
					reason: null as any,
					reply: null as any,
				});
			}
		}
		return null;
	}

	getRepostedStatusRaw(): any {
		if (
			this.post.uri ===
				'at://did:plc:iqk7tmzyrrczk7rnhqds63l3/app.bsky.feed.post/3m47nor6wqk26' ||
			this.post.uri ===
				'at://did:plc:c5rh46ed6kpelxloeaycpsb7/app.bsky.feed.post/3m2tpa67rn22n'
		) {
			console.log(
				'embed type for',
				this.post?.uri,
				'is',
				this.post?.embed?.$type,
			);
		}

		if (this.isShare()) {
			/**
			 * by returning only the post-record
			 * and stripping reason/reply records,
			 * we avoid calling this function recursively
			 */
			return { post: this.post };
		}
		if (this.isQuote()) {
			switch (this.post.embed!.$type) {
				case 'app.bsky.embed.recordWithMedia#view': {
					const _embed = this.post.embed as AppBskyEmbedRecordWithMedia.View;

					// also has record?.media object
					return { post: _embed.record.record };
				}
				case 'app.bsky.embed.record#view': {
					const _embed = this.post.embed as AppBskyEmbedRecord.View;

					if (
						this.post.uri ===
						'at://did:plc:iqk7tmzyrrczk7rnhqds63l3/app.bsky.feed.post/3m47nor6wqk26'
					) {
						console.log('returned post in question', _embed.record);
						// console.log('post in question', this.post);
						// console.log('embed in question', this.post.embed);
					}

					return { post: _embed.record };
				}
				default:
					return null;
			}
		}
		return null;
	}

	hasParentAvailable = () => !!this.reply?.parent;
	getParentRaw = () => this.reply?.parent;
	hasRootAvailable = () => !!this.reply?.root;
	getRootRaw = () => this.reply?.root;

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
		return (
			(this.post?.record as any)?.text ||
			((this.post as any)?.value as any)?.text
		);
	}

	getFacets() {
		// handle pure reposts
		if (this.isShare()) return [];

		// TODO: handle quotes
		return (this.post?.record as any)?.facets || [];
	}

	getUser() {
		if (this.isShare()) return this.reason!.by;
		return this.post.author;
	}

	isQuote = () =>
		this.post.embed !== undefined &&
		(this.post.embed.$type === 'app.bsky.embed.record#view' ||
			this.post.embed.$type === 'app.bsky.embed.recordWithMedia#view');
	// && '$type': 'app.bsky.feed.defs#postView';

	isShare = () => this.reason?.$type === 'app.bsky.feed.defs#reasonRepost';

	isReposted = () => this.isShare() || this.isQuote();

	getMediaAttachments(): MediaAttachmentTargetInterface[] {
		// it seemed that some quotes can be made with image embed...
		if ((this.reason as any)?.$type === 'app.bsky.feed.defs#reasonRepost') {
			return [];
		}

		if (this.post.embed) {
			switch (this.post.embed.$type) {
				case 'app.bsky.embed.external#view': {
					// Links to external sites (see getUrlAttachments)
					return [];
				}
				case 'app.bsky.embed.external': {
					// GIFs, Tenor etc.
					// tenor etc.
					if (EmbedViewProcessor_External_2.isCompatible(this.post.embed))
						return EmbedViewProcessor_External_2.compile(
							this.post.embed as any,
						);
					else return [];
				}
				case 'app.bsky.embed.images': {
					// should not be an issue, I guess...
					console.log("[WARN]: app.bsky.embed.images' type not handled!");

					// images#view is present at root level
					// if (EmbedViewProcessor_ImagesView.isCompatible(this.embed))
					// 	return EmbedViewProcessor_ImagesView.compile(this.embed as any);
					// else return [];
					return [];
				}
				case 'app.bsky.embed.images#view': {
					if (EmbedViewProcessor_ImagesView.isCompatible(this.post.embed))
						return EmbedViewProcessor_ImagesView.compile(
							this.post.embed as any,
						);
					else return [];
				}
				case 'app.bsky.embed.recordWithMedia#view': {
					if (EmbedViewProcessor_RecordWithMedia.isCompatible(this.post.embed))
						return EmbedViewProcessor_RecordWithMedia.compile(this.post.embed);
					else return [];
				}
				case 'app.bsky.embed.video#view': {
					if (EmbedViewProcessor_Video.isCompatible(this.post.embed))
						return EmbedViewProcessor_Video.compile(this.post.embed as any);
					else return [];
				}
				case 'app.bsky.embed.record#view': {
					// this is a quote post. no media attachments
					return [];
				}
				default: {
					console.log(
						'[WARN]: this.post.embed type not handled!',
						this.post.embed,
					);
				}
			}
		}

		// if (this.post.$type === 'app.bsky.embed.record#viewRecord') {
		// 	// this handles an original post attached to a quote post
		// 	const embeds = this.post.embeds as any;
		//
		// 	if (embeds && Array.isArray(embeds)) {
		// 		const attachments = [];
		//
		// 		for (const embed of embeds) {
		// 			if (EmbedViewProcessor_ImagesView.isCompatible(embed))
		// 				attachments.push(...EmbedViewProcessor_ImagesView.compile(embed));
		//
		// 			if (EmbedViewProcessor_Video.isCompatible(embed))
		// 				attachments.push(...EmbedViewProcessor_Video.compile(embed));
		// 		}
		// 		return attachments;
		// 	}
		// } else if (
		// 	// FIXME: how to extract images for quote posts
		// 	(this.reason as any)?.$type === 'app.bsky.feed.defs#reasonRepost'
		// ) {
		// 	return [];
		// }

		return [];
	}

	getLinkAttachments(): PostLinkAttachmentObjectType[] {
		if (this.post.embed) {
			switch (this.post.embed.$type) {
				case 'app.bsky.embed.external#view': {
					if (LinkEmbedProcessor_External.isCompatible(this.post.embed))
						return LinkEmbedProcessor_External.compile(this.post.embed as any);
					else return [];
				}
				default: {
					return [];
				}
			}
		}
		return [];
	}

	getMentions(): DhaagaJsMentionObject[] {
		const facets: BlueskyRichTextFacet[] = (this.post?.record as any)?.facets;
		if (facets) {
			facets
				.filter((o) => o.features.every(AppBskyRichtextFacet.isMention))
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
	getQuotesCount = () => this.post?.quoteCount || 0;
	// TODO: not implemented by interface
	getQuoteCount = () => this.post?.quoteCount || 0;

	getAccountId_Poster(): string {
		throw new Error('Method not implemented.');
	}

	isValid = () => true;

	isReply = () => !!this.reply;

	getParentStatusId(): string | null | undefined {
		return (this.post.record as any).reply?.parent?.uri ?? null;
	}

	getUserIdParentStatusUserId(): string | null | undefined {
		return null;
	}

	getIsSensitive = () => false;

	getSpoilerText = () => null;

	setDescendents = (items: PostTargetInterface[]) => [];
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
	getIsBookmarked = () => this.getViewer()?.bookmarked ?? false;
}

export default AtprotoPostAdapter;
