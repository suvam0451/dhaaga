import { BaseEntity, Entity } from '@dhaaga/orm';
import { APP_PINNED_OBJECT_TYPE } from '../services/driver.service';

export const DATABASE_NAME = 'app.db';

@Entity('account')
export class Account extends BaseEntity<Account> {
	uuid: string;
	identifier: string;
	driver: string;
	server: string;
	username: string;
	avatarUrl: string | null;
	displayName: string | null;
	selected: boolean;
	active: boolean;

	// inverse joins
	metadata: AccountMetadata[];
}

/**
 * List of known metadata:
 * 	- displayName
 * 	- userIdentifier
 * 	- accessToken
 * 	- avatarUrl
 */
@Entity('accountMetadata')
export class AccountMetadata extends BaseEntity<AccountMetadata> {
	key: string;
	value: string;
	type: string;
	active: boolean;
	accountId: number | null;

	// joins
	account?: Account;
}

@Entity('profile')
export class Profile extends BaseEntity<Profile> {
	uuid: string;
	name: string;
	selected: boolean;
	active: boolean;
	accountId: number | null;

	// joins
	account?: Account;
}

@Entity('appSetting')
export class AppSetting extends BaseEntity<AppSetting> {
	key: string;
	value: string;
	type: string;
}

@Entity('profileSetting')
export class ProfileSetting extends BaseEntity<ProfileSetting> {
	key: string;
	value: string;
	type: string;
}

@Entity('migrations')
export class Migration extends BaseEntity<Migration> {
	userVersion: string;
	versionCode: string;
	name: string;
}

/**
 * For the intent of pinning and search history
 *
 */
@Entity('knownServer')
export class KnownServer extends BaseEntity<KnownServer> {
	uuid: string;
	server: string;
	driver: string;
	profileId: number | null;

	// joins
	profile?: Profile;
}

@Entity('profilePinnedTimeline')
export class ProfilePinnedTimeline extends BaseEntity<ProfilePinnedTimeline> {
	uuid: string;
	server: string;
	category: APP_PINNED_OBJECT_TYPE;
	driver: string;

	// pin meta
	required: boolean; // some pins can be hidden, but not removed.
	show: boolean;
	itemOrder: number; // determines order
	page: number; // not used

	/**
	 * alternate name for the pinned item
	 *
	 * Conditions = { required: false }
	 * require
	 */
	alias: string | null;

	/**
	 * The stored previous min/max ids
	 */
	minId: string | null;
	maxId: string | null;
	/**
	 * replaces the min/max ids on successful timeline exit
	 */
	minIdNext: string | null;
	maxIdNext: string | null;

	minIdDraft: string | null;
	maxIdDraft: string | null;

	unseenCount: number;
	/**
	 * Fallback, when the draft/next
	 * set was not written properly
	 * due to unexpected exists
	 */
	lastCommitMaxId: string | null;

	// joins
	profile?: Profile;

	profileId: number | null;
	active: boolean;
}

@Entity('profilePinnedUser')
export class ProfilePinnedUser extends BaseEntity<ProfilePinnedUser> {
	uuid: string;
	server: string;
	category: APP_PINNED_OBJECT_TYPE;
	driver: string;

	// pin meta
	required: boolean; // some pins can be hidden, but not removed.
	show: boolean;
	itemOrder: number; // determines order
	page: number; // not used

	/**
	 * alternate name for the pinned item
	 *
	 * Conditions = { required: false }
	 * require
	 */
	alias: string | null;

	/**
	 * The stored previous min/max ids
	 */
	minId: string | null;
	maxId: string | null;
	/**
	 * replaces the min/max ids on successful timeline exit
	 */
	minIdNext: string | null;
	maxIdNext: string | null;

	minIdDraft: string | null;
	maxIdDraft: string | null;

	unseenCount: number;
	/**
	 * Fallback, when the draft/next
	 * set was not written properly
	 * due to unexpected exists
	 */
	lastCommitMaxId: string | null;

	// joins
	profile?: Profile;

	// these columns are extra on top
	identifier: string;
	username: string;
	avatarUrl: string | null;
	displayName: string | null;
	profileId: number | null;
	active: boolean;
}

@Entity('profilePinnedTag')
export class ProfilePinnedTag extends BaseEntity<ProfilePinnedTag> {
	uuid: string;
	server: string;
	category: APP_PINNED_OBJECT_TYPE;
	driver: string;

	// pin meta
	required: boolean; // some pins can be hidden, but not removed.
	show: boolean;
	itemOrder: number; // determines order
	page: number; // not used

	/**
	 * alternate name for the pinned item
	 *
	 * Conditions = { required: false }
	 * require
	 */
	alias: string | null;

	/**
	 * The stored previous min/max ids
	 */
	minId: string | null;
	maxId: string | null;
	/**
	 * replaces the min/max ids on successful timeline exit
	 */
	minIdNext: string | null;
	maxIdNext: string | null;

	minIdDraft: string | null;
	maxIdDraft: string | null;

	unseenCount: number;
	/**
	 * Fallback, when the draft/next
	 * set was not written properly
	 * due to unexpected exists
	 */
	lastCommitMaxId: string | null;

	// joins
	profile?: Profile;

	// these columns are extra on top
	identifier: string;
	name: string;
	profileId: number | null;
	active: boolean;
}

/**
 * List of known metadata (SERVER_METADATA_KEY)
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
@Entity('knownServerMetadata')
export class KnownServerMetadata extends BaseEntity<KnownServerMetadata> {
	key: string;
	value: string;
	type: string;
	active: boolean;
	knownServerId: number | null;

	// joins
	knownServer?: KnownServer;
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
};

// serverEmojiAlias
export type ServerEmojiAlias = {
	serverEmojiId: number; // fk (composite key)
	alias: string; // (composite key)
};

// hashtag
export type Hashtag = {
	name: string; // unique
};

// accountHashtag
export type AccountHashtag = {
	followed: boolean;
	private: boolean;
	hashtagId: number | null;
	accountId: number | null;
	account?: Account;
	hashtag?: Hashtag;
};

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
};

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
};

export type Setting = {
	key: string;
	value: string;
	type: string;
};
