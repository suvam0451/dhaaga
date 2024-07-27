import {
	NoteInstance,
	Status,
	StatusContextInstance,
	StatusContextInterface,
	StatusInterface,
} from './_interface.js';
import { DriveFile } from 'misskey-js/autogen/models.js';
import { DriveFileToMediaAttachmentAdapter } from '../media-attachment/adapter.js';
import { DriveFileInstance } from '../media-attachment/unique.js';
import { UserType } from '../profile/_interface.js';

export class MisskeyToStatusContextAdapter implements StatusContextInterface {
	ref: StatusInterface;
	ctx: StatusContextInstance;

	constructor(ref: StatusInterface, ctx: StatusContextInstance) {
		this.ref = ref;
		this.ctx = ctx;
	}

	addChildren(items: StatusInterface[]): void {
		throw new Error('Method not implemented.');
	}

	getId(): string {
		throw new Error('Method not implemented.');
	}

	getChildren() {
		return [];
	}

	getParent() {
		return null;
	}

	getRoot() {
		return null;
	}
}

class MisskeyToStatusAdapter implements StatusInterface {
	ref: NoteInstance;

	constructor(ref: NoteInstance) {
		this.ref = ref;
	}

	getReactions(): { id: string; count: number }[] {
		const retval = [];
		const src = this.ref.instance?.reactions || {};
		for (const k in src) {
			retval.push({ id: k, count: src[k] });
		}
		return retval;
	}

	// reactionAcceptance
	// :
	// "likeOnlyForRemote"

	getReactionEmojis(): {
		height?: number | undefined;
		width?: number | undefined;
		name: string;
		url: string;
	}[] {
		const retval = [];
		const src = this.ref.instance?.reactionEmojis || {};
		for (const k in src) {
			if (typeof src[k] === 'string') {
				// misskey
				retval.push({ name: k, url: src[k] });
			} else {
				// firefish
				retval.push({
					name: (src[k] as any)?.['name'],
					url: (src[k] as any)?.['url'],
					height: (src[k] as any)?.['height'],
					width: (src[k] as any)?.['width'],
				});
			}
		}
		return retval;
	}

	getIsRebloggedByMe(): boolean | null | undefined {
		return false;
	}

	getIsSensitive(): boolean {
		return (
			this.ref.instance?.cw !== undefined && this.ref.instance?.cw !== null
		);
	}

	getSpoilerText(): string | null | undefined {
		return this.ref.instance?.cw;
	}

	getRaw(): Status {
		return this?.ref?.instance;
	}

	getIsFavourited(): boolean | null | undefined {
		return false;
	}

	setDescendents(items: StatusInterface[]): void {
		return;
	}

	getDescendants(): StatusInterface[] {
		return [];
	}

	getUser(): UserType {
		return this?.ref?.instance?.user;
	}

	isReply(): boolean {
		return (
			this.ref.instance?.reply !== undefined &&
			this.ref.instance?.reply !== null
		);
	}

	getParentStatusId(): string | null | undefined {
		return null;
	}

	getUserIdParentStatusUserId(): string | null | undefined {
		return null;
	}

	getRepostedStatusRaw = () => this.ref?.instance?.renote;

	getIsBookmarked(): boolean {
		return false;
	}

	isValid() {
		return this.ref?.instance !== undefined && this.ref?.instance !== null;
	}

	getId = () => this.ref?.instance?.id;
	getRepliesCount = () => this.ref?.instance?.repliesCount;
	getRepostsCount = () => this.ref?.instance?.renoteCount;
	getFavouritesCount = () => -1;
	getUsername = () => this.ref?.instance?.user.username;
	getDisplayName = () => this.ref?.instance?.user.name;
	getAvatarUrl = () => this.ref?.instance?.user.avatarUrl;
	getCreatedAt = () => this.ref?.instance?.createdAt || new Date().toString();

	getVisibility() {
		return this.ref?.instance?.visibility;
	}

	getAccountUrl(mySubdomain?: string) {
		if (
			this.ref.instance?.user?.host === undefined ||
			this.ref.instance?.user?.host === null
		) {
			return `https://${mySubdomain}/@${this.ref.instance?.user?.username}`;
		}
		return `https://${this.ref.instance?.user?.host}/@${this.ref.instance?.user?.username}`;
	}

	getRepostedStatus(): StatusInterface | null | undefined {
		if (
			this.ref?.instance?.renote !== undefined &&
			this.ref.instance?.renote !== null
		) {
			return new MisskeyToStatusAdapter(
				new NoteInstance(this.ref?.instance?.renote),
			) as unknown as StatusInterface;
		}
		return null;
	}

	getMediaAttachments() {
		if (!this.ref?.instance?.files) {
			return [];
		}
		return this.ref?.instance?.files.map((o: DriveFile) => {
			return new DriveFileToMediaAttachmentAdapter(
				new DriveFileInstance(o),
			) as any;
		});
	}

	isReposted() {
		return (
			this.ref?.instance?.renote !== undefined &&
			this.ref?.instance?.renote !== null
		);
	}

	getContent() {
		return this.ref?.instance?.text;
	}

	print(): void {
		console.log(this.ref.instance);
	}

	getAccountId_Poster(): string {
		return this?.ref?.instance?.user?.id;
	}
}

export default MisskeyToStatusAdapter;
