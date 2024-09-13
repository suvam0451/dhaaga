import {
	DhaagaJsMentionObject,
	Status,
	StatusInterface,
} from './_interface.js';
import { DriveFile } from 'misskey-js/autogen/models.js';
import { DriveFileToMediaAttachmentAdapter } from '../media-attachment/adapter.js';
import { DriveFileInstance } from '../media-attachment/unique.js';
import { UserType } from '../profile/_interface.js';
import UnknownToStatusAdapter from './default.js';
import { Note } from 'misskey-js/autogen/models.d.ts';

class MisskeyToStatusAdapter
	extends UnknownToStatusAdapter
	implements StatusInterface
{
	ref: Note;

	constructor(ref: Note) {
		super();
		this.ref = ref;
	}

	getCachedEmojis(): Map<string, string> {
		return new Map<string, string>();
	}

	getMentions(): DhaagaJsMentionObject[] {
		return (
			this.ref.mentions?.map((o) => ({
				id: o,
			})) || []
		);
	}

	getReactions(myReaction?: string): {
		id: string;
		count: number;
		me: boolean;
		accounts: string[];
		url: string | null;
	}[] {
		const retval = [];
		const src = this.ref.reactions || {};
		for (const k in src) {
			retval.push({
				id: k,
				count: src[k],
				me: k === myReaction,
				accounts: [],
				url: null,
			});
		}
		return retval;
	}

	getParentRaw(): Status {
		return this.ref.reply;
	}

	getReactionEmojis(): {
		height?: number | undefined;
		width?: number | undefined;
		name: string;
		url: string;
	}[] {
		const retval = [];
		const src = this.ref.reactionEmojis || {};
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
		return this.ref.cw !== undefined && this.ref.cw !== null;
	}

	getSpoilerText(): string | null | undefined {
		return this.ref.cw;
	}

	getRaw(): Status {
		return this?.ref;
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
		return this?.ref?.user;
	}

	isReply(): boolean {
		return this.ref.reply !== undefined && this.ref.reply !== null;
	}

	getParentStatusId(): string | null | undefined {
		return this.ref.replyId;
	}

	getUserIdParentStatusUserId(): string | null | undefined {
		return null;
	}

	getRepostedStatusRaw = () => this.ref?.renote;

	getIsBookmarked(): boolean {
		return false;
	}

	getId() {
		return this.ref?.id;
	}

	getRepliesCount() {
		return this.ref?.repliesCount;
	}

	getRepostsCount() {
		return this.ref?.renoteCount;
	}

	getFavouritesCount() {
		return 0;
	}

	getUsername() {
		return this.ref?.user?.username;
	}

	getDisplayName() {
		return this.ref?.user?.name;
	}

	getAvatarUrl() {
		return this.ref?.user?.avatarUrl;
	}

	getCreatedAt() {
		return this.ref?.createdAt || new Date().toString();
	}

	getVisibility() {
		return this.ref?.visibility;
	}

	getAccountUrl(mySubdomain?: string) {
		if (this.ref.user?.host === undefined || this.ref.user?.host === null) {
			return `https://${mySubdomain}/@${this.ref.user?.username}`;
		}
		return `https://${this.ref.user?.host}/@${this.ref.user?.username}`;
	}

	getRepostedStatus(): StatusInterface | null | undefined {
		if (this.ref?.renote !== undefined && this.ref.renote !== null) {
			return new MisskeyToStatusAdapter(this.ref?.renote);
		}
		return null;
	}

	getQuote(): StatusInterface | null | undefined {
		return null;
	}

	getMediaAttachments() {
		if (!this.ref?.files) {
			return [];
		}
		return this.ref?.files.map((o: DriveFile) => {
			return new DriveFileToMediaAttachmentAdapter(
				new DriveFileInstance(o),
			) as any;
		});
	}

	isReposted() {
		return this.ref?.renote !== undefined && this.ref?.renote !== null;
	}

	getContent() {
		return this.ref?.text;
	}

	print(): void {
		console.log(this.ref);
	}

	getAccountId_Poster(): string {
		return this?.ref?.user?.id;
	}

	getMyReaction(): string | null | undefined {
		return this.ref.myReaction;
	}
}

export default MisskeyToStatusAdapter;
