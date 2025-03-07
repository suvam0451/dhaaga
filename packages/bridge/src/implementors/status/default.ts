import { UserType } from '../profile/_interface.js';
import {
	DhaagaJsMentionObject,
	Status,
	PostTargetInterface,
} from './_interface.js';
import { PostView } from '@atproto/api/dist/client/types/app/bsky/feed/defs.js';
import type { MediaAttachmentTargetInterface } from '../media-attachment/_interface.js';

class PostAdapterBase implements PostTargetInterface {
	getCid(): string | null {
		return null;
	}
	getUri(): string | null {
		return null;
	}
	/**
	 * Post Hierarchy
	 */
	hasParentAvailable() {
		return false;
	}
	getParentRaw(): Status | PostView | null {
		return null;
	}
	hasRootAvailable() {
		return false;
	}
	getRootRaw() {
		return undefined;
	}
	hasQuoteAvailable(): boolean {
		return false;
	}
	getQuoteRaw(): PostView | undefined | null {
		return null;
	}

	getMentions(): DhaagaJsMentionObject[] {
		return [];
	}

	getMyReaction(): string | null | undefined {
		return null;
	}

	getCachedEmojis(): Map<string, string> {
		return new Map<string, string>();
	}

	getReactions(): {
		id: string;
		count: number;
		me: boolean;
		accounts: string[];
		url: string | null;
	}[] {
		return [];
	}

	getReactionEmojis(): {
		height?: number | undefined;
		width?: number | undefined;
		name: string;
		url: string;
	}[] {
		return [];
	}

	getIsRebloggedByMe(): boolean | null | undefined {
		return false;
	}

	getIsSensitive(): boolean {
		return false;
	}

	getSpoilerText(): string | null | undefined {
		return '';
	}

	getRaw(): Status {
		return null;
	}

	getUser(): UserType {
		throw new Error('Method not implemented.');
	}

	isReply(): boolean {
		return false;
	}

	getParentStatusId(): string | null | undefined {
		return null;
	}

	getUserIdParentStatusUserId(): string | null | undefined {
		return null;
	}

	getRepostedStatusRaw(): Status {
		return null;
	}

	getQuote(): PostTargetInterface | null | undefined {
		return undefined;
	}

	getIsBookmarked(): boolean | null | undefined {
		return false;
	}

	getIsFavourited(): boolean | null | undefined {
		return false;
	}

	getRepliesCount(): number {
		return -1;
	}

	getId(): string {
		return '';
	}

	getRepostsCount(): number {
		return 0;
	}

	getFavouritesCount(): number {
		return 0;
	}

	getUsername() {
		return '';
	}

	getDisplayName(): string | null | undefined {
		return '';
	}

	getAvatarUrl(): string | null | undefined {
		return '';
	}

	getCreatedAt() {
		return new Date().toString();
	}

	getVisibility() {
		return '';
	}

	getAccountUrl() {
		return '';
	}

	getRepostedStatus(): PostTargetInterface | null | undefined {
		return null;
	}

	isReposted() {
		return false;
	}

	getContent(): string | null | undefined {
		return '';
	}

	getFacets = () => [];

	getMediaAttachments(): MediaAttachmentTargetInterface[] {
		return [];
	}

	print() {
		console.log('Unknown status type');
	}

	getAccountId_Poster(): string {
		return '';
	}
}

export default PostAdapterBase;
