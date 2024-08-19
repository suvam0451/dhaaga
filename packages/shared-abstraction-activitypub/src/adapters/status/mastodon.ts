import {
	DhaagaJsMentionObject,
	Status,
	StatusContextInstance,
	StatusContextInterface,
	StatusInstance,
	StatusInterface,
} from './_interface.js';
import { MediaAttachmentToMediaAttachmentAdapter } from '../media-attachment/adapter.js';
import { MediaAttachmentInstance } from '../media-attachment/unique.js';
import { UserType } from '../profile/_interface.js';

class MastodonToStatusAdapter implements StatusInterface {
	ref: StatusInstance;
	descendants: StatusInterface[];

	constructor(ref: StatusInstance) {
		this.ref = ref;
		this.descendants = [];
	}

	getMentions(): DhaagaJsMentionObject[] {
		return this.ref.instance?.mentions || [];
	}

	getReactions(): { id: string; count: number }[] {
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
		return this.ref.instance?.reblogged;
	}

	getIsSensitive(): boolean {
		return this.ref.instance?.sensitive;
	}

	getSpoilerText(): string | null | undefined {
		return this.ref.instance?.spoilerText;
	}

	getRaw(): Status {
		return this?.ref?.instance;
	}

	getRepliedStatusRaw(): Status {
		return null;
	}

	getIsFavourited(): boolean | null | undefined {
		return this.ref.instance?.favourited;
	}

	setDescendents(items: StatusInterface[]): void {
		throw new Error('Method not implemented.');
	}

	getDescendants(): StatusInterface[] {
		throw new Error('Method not implemented.');
	}

	getUser(): UserType {
		return this?.ref?.instance?.account;
	}

	isReply() {
		return (
			this?.ref?.instance?.inReplyToId !== '' &&
			this?.ref?.instance?.inReplyToId !== null &&
			this?.ref?.instance?.inReplyToId !== undefined
		);
	}

	getParentStatusId() {
		return this?.ref?.instance?.inReplyToId;
	}

	getUserIdParentStatusUserId() {
		return this?.ref?.instance?.inReplyToAccountId;
	}

	getIsBookmarked() {
		return this?.ref?.instance?.bookmarked;
	}

	isValid() {
		return this.ref?.instance !== undefined && this.ref?.instance !== null;
	}

	getId(): string {
		return this.ref?.instance?.id;
	}

	getAccountId() {}

	getRepliesCount(): number {
		return this.ref?.instance?.repliesCount;
	}

	getRepostsCount(): number {
		return this.ref?.instance?.reblogsCount;
	}

	getFavouritesCount(): number {
		return this.ref?.instance?.favouritesCount;
	}

	getUsername() {
		return this.ref?.instance?.account.username || '';
	}

	getDisplayName() {
		return this.ref?.instance?.account.displayName || '';
	}

	getAvatarUrl() {
		return this.ref?.instance?.account.avatarStatic || '';
	}

	getCreatedAt() {
		return this.ref.instance?.createdAt || new Date().toString();
	}

	getVisibility() {
		return this.ref?.instance?.visibility;
	}

	getAccountUrl() {
		return this.ref?.instance?.account.url;
	}

	getRepostedStatus() {
		if (this.ref?.instance?.reblog) {
			return new MastodonToStatusAdapter(
				new StatusInstance(this.ref?.instance?.reblog),
			) as unknown as StatusInterface;
		}
		return null;
	}

	getQuote() {
		return (this.ref.instance as any).quote;
	}

	getRepostedStatusRaw() {
		return this.ref?.instance?.reblog as any;
	}

	isReposted(): boolean {
		return this.ref?.instance?.reblog !== null;
	}

	getMediaAttachments() {
		return this.ref?.instance?.mediaAttachments?.map((o) => {
			return new MediaAttachmentToMediaAttachmentAdapter(
				new MediaAttachmentInstance(o),
			);
		});
	}

	getContent(): string | null {
		return this.ref?.instance?.content;
	}

	print(): void {
		console.log(this.ref.instance);
	}

	getAccountId_Poster(): string {
		return this?.ref?.instance?.account?.id;
	}
}

export class MastodonToStatusContextAdapter implements StatusContextInterface {
	ref: StatusInterface;
	ctx: StatusContextInstance;

	constructor(ref: StatusInterface, ctx: StatusContextInstance) {
		this.ref = ref;
		this.ctx = ctx;
	}

	addChildren(items: StatusInterface[]): void {
		this.ctx.addChildren(items);
	}

	getId(): string {
		return this.ref.getId();
	}

	getChildren() {
		return this.ctx.children;
	}

	getParent() {
		return this.ctx.parent;
	}

	getRoot() {
		return null;
	}
}

export default MastodonToStatusAdapter;
