import { ActivityPubStatus } from './activitypub-status.entity';
import { ActivityPubTag } from './activitypub-tag.entity';

export class KeyValuePair extends Object {
	_id: Realm.BSON.UUID;
	key: string;
	value: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export class Account extends Object {
	_id: Realm.BSON.UUID;
	domain: string; // abstraction layer --> mastodon/misskey
	subdomain: string; // instance --> mastodon.social/misskey.io
	username: string;
	displayName?: string;
	avatarUrl?: string;
	password?: string;
	createdAt: Date;
	updatedAt: Date;
	verified?: boolean;
	settings: Realm.List<KeyValuePair>;
	secrets: Realm.List<KeyValuePair>;

	bookmarks: Realm.List<ActivityPubStatus>;
	favourites: Realm.List<ActivityPubStatus>;
	hashtags: Realm.List<ActivityPubTag>;

	bookmarksLastSyncedAt?: Date;
	favouritesLastSyncedAt?: Date;
	hashtagsLastSyncedAt?: Date;

	selected: boolean;
}
