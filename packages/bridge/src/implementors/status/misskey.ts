import { PostTargetInterface } from './_interface.js';
import { DriveFile } from 'misskey-js/autogen/models.js';
import { DriveFileToMediaAttachmentAdapter } from '../media-attachment/adapter.js';
import { DriveFileInstance } from '../media-attachment/unique.js';
import { Note } from 'misskey-js/autogen/models.js';
import { PostLinkAttachmentObjectType } from '#/types/shared/link-attachments.js';

class MisskeyApiPostAdapter implements PostTargetInterface {
	ref: Note;

	constructor(ref: Note) {
		this.ref = ref;
	}

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

	isReply = () => !!this.ref.replyId;
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
		const _reactionEmojis = this.ref.reactionEmojis;
		if (_reactionEmojis) {
			for (const k in _reactionEmojis) {
				if (typeof _reactionEmojis[k] === 'string') {
					// misskey
					retval.push({ name: k, url: _reactionEmojis[k] });
				} else {
					// firefish
					retval.push({
						name: (_reactionEmojis[k] as any)?.['name'],
						url: (_reactionEmojis[k] as any)?.['url'],
						height: (_reactionEmojis[k] as any)?.['height'],
						width: (_reactionEmojis[k] as any)?.['width'],
					});
				}
			}
		}

		// CherryPick ?
		const _emojis = this.ref.emojis;
		if (_emojis) {
			for (const k in _emojis) {
				if (typeof _emojis[k] === 'string') {
					// misskey
					retval.push({ name: k, url: _emojis[k] });
				} else {
					// firefish
					retval.push({
						name: (_emojis[k] as any)?.['name'],
						url: (_emojis[k] as any)?.['url'],
						height: (_emojis[k] as any)?.['height'],
						width: (_emojis[k] as any)?.['width'],
					});
				}
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

	getRepostedStatusRaw = () => {
		return this.ref.renote;
	};

	getId = () => this.ref.id;

	getRepliesCount = () => this.ref.repliesCount ?? 0;

	getRepostsCount = () => this.ref.renoteCount ?? 0;

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

	getRepostedStatus(): PostTargetInterface | null | undefined {
		if (this.ref?.renote !== undefined && this.ref.renote !== null) {
			return new MisskeyApiPostAdapter(this.ref?.renote);
		}
		return null;
	}

	getQuote(): PostTargetInterface | null | undefined {
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

	/**
	 * For Misskey, we must make extra api requests to
	 * the proxy server to resolve the links:
	 *
	 * https://misskey.io/url?url=https%3A%2F%2Fsuvam.io%2F&lang=ja-JP
	 */
	getLinkAttachments(): PostLinkAttachmentObjectType[] {
		return [];
	}

	getContent = () => this.ref?.text;

	getFacets = () => [];

	print() {
		console.log(this.ref);
	}

	getAccountId_Poster = (): string => this?.ref?.user?.id;

	getMyReaction = (): string | null | undefined => this.ref.myReaction;

	getCachedEmojis(): Map<string, string> {
		return new Map();
	}

	getCid(): string | null {
		return null;
	}

	getFavouritesCount(): number {
		return 0;
	}

	getIsBookmarked(): boolean | null | undefined {
		return undefined;
	}

	getIsRebloggedByMe(): boolean | null | undefined {
		return undefined;
	}

	getQuoteRaw(): undefined | null {
		return undefined;
	}

	getRootRaw(): undefined | null {
		return undefined;
	}

	getUri(): string | null {
		return null;
	}

	hasQuoteAvailable(): boolean {
		return false;
	}

	hasRootAvailable(): boolean {
		return false;
	}
}

export default MisskeyApiPostAdapter;
