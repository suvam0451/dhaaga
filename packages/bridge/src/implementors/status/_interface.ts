import { MediaAttachmentTargetInterface } from '../media-attachment/_interface.js';
import { Note } from 'misskey-js/autogen/models.js';
import type { mastodon } from 'masto';
import { PostView } from '@atproto/api/dist/client/types/app/bsky/feed/defs.js';
import { ProfileViewBasic } from '@atproto/api/dist/client/types/app/bsky/actor/defs.js';
import { PostLinkAttachmentObjectType } from '#/types/shared/link-attachments.js';
import { AppBskyFeedDefs } from '@atproto/api';

export type Status = mastodon.v1.Status | Note | null | undefined;
export type StatusArray = Status[];

export type DhaagaJsMentionObject = {
	id: string;
	// mastodon returns all this extra
	username?: string;
	url?: string; // "https://mastodon.social/@suvam",
	acct?: string; // "suvam@mastodon.social"
};

export type AppBlueskyAuthor = {
	associated: { chat: { allowIncoming: 'all' } };
	avatar: string;
	createdAt: Date;
	did: string;
	displayName: string;
	handle: string;
	labels: [];
	viewer: { muted: boolean; blockedBy: boolean };
};

interface PostTargetInterface {
	getRaw(): Status | PostView;

	getId(): string;

	getCid(): string | null;

	getUri(): string | null;

	getUsername(): string;

	getDisplayName(): string | null | undefined;

	getAvatarUrl(): string | null | undefined;

	getCreatedAt(): string;

	getVisibility(): string;

	getAccountUrl(mySubdomain?: string): string | null | undefined;

	getRepostedStatus(): PostTargetInterface | null | undefined;

	getRepostedStatusRaw(): Status | AppBskyFeedDefs.PostView;

	/**
	 * --- Post Hierarchy | BEGIN ---
	 */
	hasParentAvailable(): boolean;

	getParentRaw(): Status | PostView;

	hasRootAvailable(): boolean;

	getRootRaw(): PostView | undefined | null;

	hasQuoteAvailable(): boolean;

	getQuoteRaw(): PostView | undefined | null;

	/**
	 * --- Post Hierarchy | END ---
	 */

	getQuote(): PostTargetInterface | null | undefined;

	getContent(): string | null | undefined;

	getFacets(): any[];

	getUser(): any | ProfileViewBasic | null;

	isReposted(): boolean;

	getMediaAttachments(): MediaAttachmentTargetInterface[];

	/**
	 * Get external links attached/embedded in the post.
	 *
	 * For Misskey and Mastodon, the links are also
	 * part of the body content, whereas for bluesky,
	 * they are pure embeds.
	 */
	getLinkAttachments(): PostLinkAttachmentObjectType[];

	getMentions(): DhaagaJsMentionObject[];

	print(): void;

	getRepliesCount(): number;

	getIsRebloggedByMe(): boolean | null | undefined;

	getIsBookmarked(): boolean | null | undefined;

	getIsFavourited(): boolean | null | undefined;

	getRepostsCount(): number;

	getFavouritesCount(): number;

	getQuotesCount(): number;

	getAccountId_Poster(): string;

	getMyReaction(): string | null | undefined;

	isReply(): boolean;

	getParentStatusId(): string | null | undefined;

	getUserIdParentStatusUserId(): string | null | undefined;

	print(): void;

	getIsSensitive(): boolean;

	getSpoilerText(): string | null | undefined;

	getReactions(myReaction?: string): {
		id: string;
		count: number;
		me: boolean;
		accounts: string[];
		url: string | null;
	}[];

	/**
	 * Remote emojis are usually
	 * cached by the instance db
	 *
	 * These are generally not supposed
	 * to be interacted with
	 */
	getCachedEmojis(): Map<string, string>;

	getReactionEmojis(): {
		height?: number;
		width?: number;
		name: string;
		url: string;
	}[];
}

export type { PostTargetInterface };
