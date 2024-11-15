import { ObjectSchema, Object } from 'realm';
import { ActivityPubStatus } from './activitypub-status.entity';
import { ActivityPubTag } from './activitypub-tag.entity';
import * as SQLite from 'expo-sqlite';

export class KeyValuePair extends Object {
	_id: Realm.BSON.UUID;
	key: string;
	value: string;
	createdAt?: Date;
	updatedAt?: Date;

	static schema: ObjectSchema = {
		name: 'KeyValuePair',
		primaryKey: '_id',

		properties: {
			_id: 'uuid',
			key: 'string',
			value: 'string',
			createdAt: 'date?',
			updatedAt: 'date?',
		},
	};
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

	static schema: ObjectSchema = {
		name: 'Account',
		primaryKey: '_id',

		properties: {
			_id: 'uuid',
			domain: 'string',
			subdomain: 'string',
			username: 'string',
			password: 'string?',
			displayName: 'string?',
			createdAt: 'date',
			updatedAt: 'date',
			verified: 'bool?',
			settings: 'KeyValuePair[]',
			secrets: 'KeyValuePair[]',
			bookmarks: 'ActivityPubStatus[]',
			favourites: 'ActivityPubStatus[]',
			hashtags: 'ActivityPubTag[]',
			bookmarksLastSyncedAt: 'date?',
			favouritesLastSyncedAt: 'date?',
			hashtagsLastSyncedAt: 'date?',
			selected: { type: 'bool', default: false },
		},
	};
}
