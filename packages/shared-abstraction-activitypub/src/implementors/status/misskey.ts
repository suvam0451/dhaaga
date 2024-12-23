import { StatusInterface } from './_interface.js';
import { DriveFile } from 'misskey-js/autogen/models.js';
import { DriveFileToMediaAttachmentAdapter } from '../media-attachment/adapter.js';
import { DriveFileInstance } from '../media-attachment/unique.js';
import UnknownToStatusAdapter from './default.js';
import { Note } from 'misskey-js/autogen/models.js';

class MisskeyToStatusAdapter
	extends UnknownToStatusAdapter
	implements StatusInterface
{
	ref: Note;

	constructor(ref: Note) {
		super();
		this.ref = ref;
	}

	// getCachedEmojis(): Map<string, string> {
	// 	return new Map<string, string>();
	// }

	getMentions = () =>
		this.ref.mentions?.map((o) => ({
			id: o,
		})) || [];

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

	isReply = () => !!this.ref.reply;
	hasParentAvailable = () => !!this.ref.reply;
	getParentRaw = () => this.ref.reply;

	isReposted = () => !!this.ref.renote;

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

	getIsSensitive = () => !!this.ref.cw;
	getSpoilerText = () => this.ref.cw;

	getRaw = () => this?.ref;

	// needs custom steps for sharkey
	getIsFavourited(): boolean | null | undefined {
		return false;
	}

	getUser = () => this?.ref?.user;

	getParentStatusId = () => this.ref.replyId;

	getUserIdParentStatusUserId(): string | null | undefined {
		return null;
	}

	getRepostedStatusRaw = () => this.ref.renote;

	getId = () => this.ref.id;

	getRepliesCount = () => this.ref.repliesCount;

	getRepostsCount = () => this.ref.renoteCount;

	// getFavouritesCount() {
	// 	return 0;
	// }

	getUsername = () => this.ref.user?.username;

	getDisplayName = () => this.ref?.user?.name;

	getAvatarUrl = () => this.ref?.user?.avatarUrl;

	getCreatedAt = () => this.ref?.createdAt || new Date().toString();

	getVisibility = () => this.ref?.visibility;

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

	getContent = () => this.ref?.text;

	print() {
		console.log(this.ref);
	}

	getAccountId_Poster = (): string => this?.ref?.user?.id;

	getMyReaction = (): string | null | undefined => this.ref.myReaction;
}

export default MisskeyToStatusAdapter;
