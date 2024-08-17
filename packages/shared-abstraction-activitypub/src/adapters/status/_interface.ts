import { MediaAttachmentInterface } from '../media-attachment/interface.js';
import { Note } from 'misskey-js/autogen/models.d.ts';
import { UserType } from '../profile/_interface.js';
import type { mastodon } from 'masto';

export type Status = mastodon.v1.Status | Note | null | undefined;
export type StatusArray = Status[];

export type DhaagaJsMentionObject = {
	id: string;
	// mastodon returns all this extra
	username?: string;
	url?: string; // "https://mastodon.social/@suvam",
	acct?: string; // "suvam@mastodon.social"
};

export interface StatusContextInterface {
	getId(): string;

	getChildren(): StatusInterface[];

	getParent(): StatusInterface | null | undefined;

	getRoot(): StatusInterface | null | undefined;

	addChildren(items: StatusInterface[]): void;
}

export interface StatusInterface {
	getRaw(): Status;

	getId(): string;

	getUsername(): string;

	getDisplayName(): string | null;

	getAvatarUrl(): string | null;

	getCreatedAt(): string;

	getVisibility(): string;

	getAccountUrl(mySubdomain?: string): string | null | undefined;

	getRepostedStatus(): StatusInterface | null | undefined;

	getRepostedStatusRaw(): Status;

	getQuote(): StatusInterface | null | undefined;

	getContent(): string | null;

	getUser(): UserType | null;

	isReposted(): boolean;

	getMediaAttachments(): MediaAttachmentInterface[] | null | undefined;

	getMentions(): DhaagaJsMentionObject[];

	print(): void;

	getRepliesCount(): number;

	getIsRebloggedByMe(): boolean | null | undefined;

	getIsBookmarked(): boolean | null | undefined;

	getIsFavourited(): boolean | null | undefined;

	getRepostsCount(): number;

	getFavouritesCount(): number;

	getAccountId_Poster(): string;

	isValid(): boolean;

	isReply(): boolean;

	getParentStatusId(): string | null | undefined;

	getUserIdParentStatusUserId(): string | null | undefined;

	print(): void;

	getIsSensitive(): boolean;

	getSpoilerText(): string | null | undefined;

	/**
	 * Reply Thread
	 */
	setDescendents(items: StatusInterface[]): void;

	getDescendants(): StatusInterface[];

	getReactions(): { id: string; count: number }[];

	getReactionEmojis(): {
		height?: number;
		width?: number;
		name: string;
		url: string;
	}[];
}

export class StatusContextInstance {
	instance: StatusInterface;
	children: StatusInterface[];
	parent: StatusInterface | null | undefined;

	constructor(instance: StatusInterface) {
		this.instance = instance;
		this.children = [];
	}

	setParent(parent: StatusInterface | null | undefined): void {
		this.parent = parent;
	}

	addChild(item: StatusInterface) {
		this.children.push(item);
	}

	addChildren(items: StatusInterface[]) {
		this.children = this.children.concat(items);
	}
}

export class StatusInstance {
	instance: mastodon.v1.Status;
	emojiMap: Map<string, URL>;

	constructor(instance: mastodon.v1.Status) {
		this.instance = instance;
		this.emojiMap = new Map();
	}
}

export class NoteInstance {
	instance: Note;
	emojiMap: Map<string, URL>;

	constructor(instance: Note) {
		this.instance = instance;
		this.emojiMap = new Map();
	}
}
