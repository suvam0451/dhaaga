import { MediaAttachmentInterface } from '../media-attachment/interface.js';
import { Note } from 'misskey-js/autogen/models.d.ts';
import { UserType } from '../profile/_interface.js';
import type { mastodon } from 'masto';
import { PostView } from '@atproto/api/dist/client/types/app/bsky/feed/defs.js';
import { ProfileViewBasic } from '@atproto/api/dist/client/types/app/bsky/actor/defs.js';

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

export interface StatusInterface {
	getRaw(): Status | PostView;

	getId(): string;

	getUsername(): string;

	getDisplayName(): string | null | undefined;

	getAvatarUrl(): string | null | undefined;

	getCreatedAt(): string;

	getVisibility(): string;

	getAccountUrl(mySubdomain?: string): string | null | undefined;

	getRepostedStatus(): StatusInterface | null | undefined;

	getRepostedStatusRaw(): Status;

	/**
	 * --- Post Hierarchy | BEGIN ---
	 */
	hasParentAvailable(): boolean;

	getParentRaw(): Status | PostView;

	hasRootAvailable(): boolean;

	getRootRaw(): PostView | undefined | null;

	/**
	 * --- Post Hierarchy | END ---
	 */

	getQuote(): StatusInterface | null | undefined;

	getContent(): string | null | undefined;

	getUser(): UserType | ProfileViewBasic | null;

	isReposted(): boolean;

	getMediaAttachments(): MediaAttachmentInterface[];

	getMentions(): DhaagaJsMentionObject[];

	print(): void;

	getRepliesCount(): number;

	getIsRebloggedByMe(): boolean | null | undefined;

	getIsBookmarked(): boolean | null | undefined;

	getIsFavourited(): boolean | null | undefined;

	getRepostsCount(): number;

	getFavouritesCount(): number;

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
