import type { mastodon } from 'masto';
import type { Hashtag } from 'misskey-js/autogen/models.js';
import MisskeyTag from './misskey.js';
import MastodonTag from './mastodon.js';
import DefaultTag from './default.js';

export type TagType = mastodon.v1.Tag | Hashtag | null | undefined;

/**
 * Interface
 */
export interface TagInterface {
	isFollowing(): boolean | null | undefined;

	getHistory(): any | null | undefined;

	getName(): string | null | undefined;

	getUrl(): string | null | undefined;

	print(): void;
}

/**
 * Category --- Instance Typings
 */

export class MastodonTagInstance {
	instance: mastodon.v1.Tag;

	constructor(instance: mastodon.v1.Tag) {
		this.instance = instance;
	}
}

export class MisskeyTagInstance {
	instance: Hashtag;

	constructor(instance: Hashtag) {
		this.instance = instance;
	}
}

export function ActivityPubTagAdapter(tag: any, domain: string): TagInterface {
	switch (domain) {
		case 'misskey': {
			return new MisskeyTag(new MisskeyTagInstance(tag as Hashtag));
		}
		case 'mastodon': {
			return new MastodonTag(new MastodonTagInstance(tag as mastodon.v1.Tag));
		}
		default: {
			return new DefaultTag();
		}
	}
}
