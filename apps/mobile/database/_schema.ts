import { BaseEntity, Entity } from './_orm';

export const DATABASE_NAME = 'app.db';

type BaseEntityMinimalType = {
	id: number;
	createdAt: Date;
	updatedAt: Date;
};

@Entity('account')
export class Account extends BaseEntity<Account> {
	id: number;
	identifier: string;
	driver: string;
	server: string;
	username: string;
	selected: boolean;
	displayName?: string;
	avatarUrl?: string;
	metadata: AccountMetadata[];
	createdAt: Date;
	updatedAt: Date;
}

@Entity('accountMetadata')
export class AccountMetadata extends BaseEntity<AccountMetadata> {
	id: number;
	key: string;
	value: string;
	type: string;
	accountId?: number; // fk
	account?: Account;
	createdAt: Date;
	updatedAt: Date;
}

// appProfile
export type AppProfile = {
	name: string;
	selected: boolean;
} & BaseEntityMinimalType;

// server
export type Server = {
	description: string;
	url: string;
	driver: string;
} & BaseEntityMinimalType;

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
