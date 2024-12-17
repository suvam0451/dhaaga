import { BaseEntity, Entity } from '@dhaaga/orm';

export const DATABASE_NAME = 'app.db';

type BaseEntityMinimalType = {
	id: number;
	createdAt: Date;
	updatedAt: Date;
};

@Entity('appSetting')
export class AppSetting extends BaseEntity<AppSetting> {
	id: number;
	key: string;
	value: string;
	type: string;
	createdAt: Date;
	updatedAt: Date;
}

@Entity('profileSetting')
export class ProfileSetting extends BaseEntity<ProfileSetting> {
	id: number;
	key: string;
	value: string;
	type: string;
	createdAt: Date;
	updatedAt: Date;
}

@Entity('account')
export class Account extends BaseEntity<Account> {
	id: number;
	uuid: string;
	identifier: string;
	driver: string;
	server: string;
	username: string;
	avatarUrl: string | null;
	displayName: string | null;
	selected: boolean;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;

	// inverse joins
	metadata: AccountMetadata[];
}

@Entity('migrations')
export class Migration extends BaseEntity<Migration> {
	id: number;
	userVersion: string;
	versionCode: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

@Entity('accountMetadata')
export class AccountMetadata extends BaseEntity<AccountMetadata> {
	id: number;
	key: string;
	value: string;
	type: string;
	active: boolean;
	accountId: number | null;
	createdAt: Date;
	updatedAt: Date;

	// joins
	account?: Account;
}

@Entity('accountProfile')
export class AccountProfile extends BaseEntity<AccountProfile> {
	id: number;
	uuid: string;
	name: string;
	selected: boolean;
	active: boolean;
	accountId: number | null;
	createdAt: Date;
	updatedAt: Date;

	// joins
	account?: Account;
}

/**
 * For the intent of pinning and search history
 *
 */
@Entity('profileKnownServer')
export class ProfileKnownServer extends BaseEntity<ProfileKnownServer> {
	id: number;
	uuid: string;
	url: string;
	driver: string;
	profileId: number | null;
	createdAt: Date;
	updatedAt: Date;

	profile?: AccountProfile;
}

/**
 * List of known metadata:
 * 	- description
 * 	- serverName
 * 	- serverSoftware
 * 	- softwareVersion
 * 	- iconUrl
 * 	- faviconUrl
 * 	- themeColor
 * 	- nodeinfo
 * 	- nodeinfoLastFetchedAt
 * 	- nodeinfoLastAttemptAt
 * 	- customEmojisLastFetchedAt
 * 	- customEmojisLastAttemptAt
 */
@Entity('profileKnownServerMetadata')
export class ProfileKnownServerMetadata extends BaseEntity<ProfileKnownServerMetadata> {
	id: number;
	key: string;
	value: string;
	type: string;
	active: boolean;
	knownServerId: number | null;
	createdAt: Date;
	updatedAt: Date;

	// joins
	knownServer?: ProfileKnownServer;
}

// serverEmoji
export type ServerEmoji = {
	shortCode: string;
	url: string;
	staticUrl: string;
	visibleInPicker?: boolean;
	timesUsed: number;
	serverId: number; //fk
	category?: string; // default=N/A
} & BaseEntityMinimalType;

// serverEmojiAlias
export type ServerEmojiAlias = {
	serverEmojiId: number; // fk (composite key)
	alias: string; // (composite key)
} & BaseEntityMinimalType;

// hashtag
export type Hashtag = {
	name: string; // unique
} & BaseEntityMinimalType;

// accountHashtag
export type AccountHashtag = {
	followed: boolean;
	private: boolean;
	hashtagId: number | null;
	accountId: number | null;
	account?: Account;
	hashtag?: Hashtag;
} & BaseEntityMinimalType;

export type PostMediaAttachment = {
	altText?: string;
	blurhash?: string;
	attachmentId?: string;
	previewUrl?: string;
	url: string;
	type?: string;
	height?: number;
	width?: number;
	postId: number; // fk
} & BaseEntityMinimalType;

// post
export type Post = {
	identifier: string;
	content: string;

	replyToUserId: string;
	replyToPostId: string;

	shared: boolean;
	favourited: boolean;
	bookmarked: boolean;

	spoilerText: string;
	visibility: string;
	url: string; // e.g. - https://misskey.io/notes/xyz

	shareCount: number;
	replyCount: number;

	isSensitive: boolean;

	postCreatedAt: Date;
	postEditedAt: Date;
} & BaseEntityMinimalType;

export type Setting = {
	key: string;
	value: string;
	type: string;
} & BaseEntityMinimalType;
