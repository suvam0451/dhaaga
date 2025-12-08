import {
	DhaagaJsMentionObject,
	PostTargetInterface,
	Status,
} from './_interface.js';
import { MediaAttachmentToMediaAttachmentAdapter } from '../media-attachment/adapter.js';
import { MediaAttachmentInstance } from '../media-attachment/unique.js';
import type { MastoStatus } from '../../types/mastojs.types.js';
import { CasingUtil } from '../../utils/casing.js';
import {
	MastoApiCardObjectType,
	PostLinkAttachmentObjectType,
} from '#/types/shared/link-attachments.js';

class MastoApiPostAdapter implements PostTargetInterface {
	ref: MastoStatus;

	constructor(ref: MastoStatus) {
		this.ref = ref;
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

	getIsRebloggedByMe(): boolean | null | undefined {
		return this.ref.reblogged;
	}

	getIsSensitive(): boolean {
		return this.ref.sensitive;
	}

	getSpoilerText(): string | null | undefined {
		return this.ref.spoilerText;
	}

	getRaw = () => this.ref as any;

	getIsFavourited = () => this.ref.favourited;

	getUser = () => this.ref.account as any;

	isReply() {
		return (
			this.ref.inReplyToId !== '' &&
			this.ref.inReplyToId !== null &&
			this.ref.inReplyToId !== undefined
		);
	}

	getParentStatusId = () => this.ref.inReplyToId;

	getUserIdParentStatusUserId = () => this.ref.inReplyToAccountId;

	getIsBookmarked = () => this.ref.bookmarked;

	getId = () => this.ref.id;

	getRepliesCount = (): number => this.ref.repliesCount;

	getRepostsCount = (): number => this.ref.reblogsCount;

	getFavouritesCount = (): number => this.ref.favouritesCount;

	getUsername = () => this.ref.account.username || '';

	getDisplayName = () => this.ref.account.displayName || '';

	getAvatarUrl = () => this.ref.account.avatarStatic || '';

	getCreatedAt = () => this.ref.createdAt || new Date().toString();

	getVisibility = () => this.ref.visibility;

	getAccountUrl = () => (this.ref.account as any).uri || this.ref.account.url;

	getRepostedStatus(): PostTargetInterface | null {
		if (this.ref.reblog) {
			return new MastoApiPostAdapter(this.ref.reblog);
		}
		return null;
	}

	getQuote = () => (this.ref as any).quote;

	getRepostedStatusRaw = () => this.ref.reblog as any;

	isReposted = (): boolean => !!this.ref.reblog;

	getMediaAttachments() {
		return this.ref.mediaAttachments?.map((o) => {
			return new MediaAttachmentToMediaAttachmentAdapter(
				new MediaAttachmentInstance(CasingUtil.camelCaseKeys(o)),
			);
		});
	}

	getLinkAttachments(): PostLinkAttachmentObjectType[] {
		const data = this.ref.card as unknown as MastoApiCardObjectType;
		if (!data) return [];

		return [
			{
				url: data.url,
				title: data.title,
				description: data.description,
				bannerImageUrl: data.image,
				bannerWidth: data.width,
				bannerHeight: data.height,
			},
		];
	}

	getContent = () => this.ref.content;

	getFacets = () => [];

	print(): void {
		console.log(this.ref);
	}

	getAccountId_Poster = () => this.ref.account?.id;

	getCid(): string | null {
		return null;
	}

	getMyReaction(): string | null | undefined {
		return undefined;
	}

	getParentRaw(): Status {
		return undefined;
	}

	getQuoteRaw(): undefined | null {
		return undefined;
	}

	getReactionEmojis(): {
		height?: number;
		width?: number;
		name: string;
		url: string;
	}[] {
		return [];
	}

	getRootRaw(): undefined | null {
		return undefined;
	}

	getUri(): string | null {
		return null;
	}

	hasParentAvailable(): boolean {
		return false;
	}

	hasQuoteAvailable(): boolean {
		return false;
	}

	hasRootAvailable(): boolean {
		return false;
	}
}

export default MastoApiPostAdapter;
