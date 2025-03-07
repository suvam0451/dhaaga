import type { mastodon } from 'masto';
import type { Hashtag } from 'misskey-js/autogen/models.js';
import MisskeyTag from './misskey.js';
import MastodonTag from './mastodon.js';
import DefaultTag from './default.js';
import BlueskyTag from './bluesky.js';
import { KNOWN_SOFTWARE } from '../../data/driver.js';

export type TagType = mastodon.v1.Tag | Hashtag | null | undefined;

/**
 * Interface
 */
export interface TagTargetInterface {
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

export function ActivityPubTagAdapter(
	tag: any,
	domain: string,
): TagTargetInterface {
	switch (domain) {
		case KNOWN_SOFTWARE.MISSKEY:
		case KNOWN_SOFTWARE.FIREFISH:
		case KNOWN_SOFTWARE.MEISSKEY:
		case KNOWN_SOFTWARE.SHARKEY:
		case KNOWN_SOFTWARE.KMYBLUE:
		case KNOWN_SOFTWARE.CHERRYPICK: {
			return new MisskeyTag(new MisskeyTagInstance(tag as Hashtag));
		}
		case KNOWN_SOFTWARE.MASTODON: {
			return new MastodonTag(new MastodonTagInstance(tag as mastodon.v1.Tag));
		}
		case KNOWN_SOFTWARE.BLUESKY: {
			return new BlueskyTag(tag, 'N/A');
		}
		default: {
			return new DefaultTag();
		}
	}
}
