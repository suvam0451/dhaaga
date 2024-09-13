import {
	DhaagaJsMentionObject,
	Status,
	StatusInterface,
} from './_interface.js';
import { MediaAttachmentToMediaAttachmentAdapter } from '../media-attachment/adapter.js';
import { MediaAttachmentInstance } from '../media-attachment/unique.js';
import { UserType } from '../profile/_interface.js';
import camelcaseKeys from 'camelcase-keys';
import UnknownToStatusAdapter from './default.js';
import { mastodon } from '@dhaaga/shared-provider-mastodon';

class MastodonToStatusAdapter
	extends UnknownToStatusAdapter
	implements StatusInterface
{
	ref: mastodon.v1.Status;
	descendants: StatusInterface[];

	constructor(ref: mastodon.v1.Status) {
		super();
		this.ref = ref;
		this.descendants = [];
	}

	getCachedEmojis(): Map<string, string> {
		const retval = new Map<string, string>();
		this.ref.emojis?.forEach((o) => {
			retval.set(o.shortcode, o.url);
		});
		return retval;
	}

	getMentions(): DhaagaJsMentionObject[] {
		return this.ref.mentions || [];
	}

	getReactions(): {
		id: string;
		count: number;
		me: boolean;
		accounts: string[];
		url: string | null;
	}[] {
		// Akkoma
		let reactions = (this.ref as any).emojiReactions;

		// Pleroma
		if (!reactions) {
			reactions = (this.ref as any)?.pleroma?.emojiReactions;
		}

		if (!reactions) return [];
		return reactions.map((o: any) => ({
			id: o.name,
			count: o.count,
			me: o.me || false,
			accounts: o.accountIds || [],
			url: o.url, // Pleroma: null for local reactions
		}));
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
		return this.ref.reblogged;
	}

	getIsSensitive(): boolean {
		return this.ref.sensitive;
	}

	getSpoilerText(): string | null | undefined {
		return this.ref.spoilerText;
	}

	getRaw(): Status {
		return this?.ref;
	}

	getIsFavourited() {
		return this.ref.favourited;
	}

	getUser(): UserType {
		return this?.ref?.account;
	}

	isReply() {
		return (
			this?.ref?.inReplyToId !== '' &&
			this?.ref?.inReplyToId !== null &&
			this?.ref?.inReplyToId !== undefined
		);
	}

	getParentStatusId() {
		return this?.ref?.inReplyToId;
	}

	getUserIdParentStatusUserId() {
		return this?.ref?.inReplyToAccountId;
	}

	getIsBookmarked() {
		return this?.ref?.bookmarked;
	}

	getId() {
		return this.ref?.id;
	}

	getRepliesCount(): number {
		return this.ref?.repliesCount;
	}

	getRepostsCount(): number {
		return this.ref?.reblogsCount;
	}

	getFavouritesCount(): number {
		return this.ref?.favouritesCount;
	}

	getUsername() {
		return this.ref?.account.username || '';
	}

	getDisplayName() {
		return this.ref?.account.displayName || '';
	}

	getAvatarUrl() {
		return this.ref?.account.avatarStatic || '';
	}

	getCreatedAt() {
		return this.ref.createdAt || new Date().toString();
	}

	getVisibility() {
		return this.ref?.visibility;
	}

	getAccountUrl() {
		return this.ref?.account.url;
	}

	getRepostedStatus() {
		if (this.ref?.reblog) {
			return new MastodonToStatusAdapter(this.ref?.reblog);
		}
		return null;
	}

	getQuote() {
		return (this.ref as any).quote;
	}

	getRepostedStatusRaw() {
		return this.ref?.reblog as any;
	}

	isReposted(): boolean {
		return this.ref?.reblog !== null;
	}

	getMediaAttachments() {
		return this.ref?.mediaAttachments?.map((o) => {
			return new MediaAttachmentToMediaAttachmentAdapter(
				new MediaAttachmentInstance(camelcaseKeys(o as any, { deep: true })),
			);
		});
	}

	getContent() {
		return this.ref?.content;
	}

	print(): void {
		console.log(this.ref);
	}

	getAccountId_Poster(): string {
		return this?.ref?.account?.id;
	}
}

export default MastodonToStatusAdapter;
