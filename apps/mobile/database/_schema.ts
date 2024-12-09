export const DATABASE_NAME = 'app.db';

type BaseEntity = {
	id: number;
	createdAt: Date;
	updatedAt: Date;
};

// account
export type Account = {
	identifier: string;
	driver: string;
	server: string;
	username: string;
	selected: boolean;
	displayName?: string;
	avatarUrl?: string;
	metadata: AccountMetadata[];
} & BaseEntity;

// accountMetadata
export type AccountMetadata = {
	key: string;
	value: string;
	type: string;
	accountId?: number; // fk
	account?: Account;
} & BaseEntity;

// appProfile
export type AppProfile = {
	name: string;
	selected: boolean;
} & BaseEntity;

// server
export type Server = {
	description: string;
	url: string;
	driver: string;
} & BaseEntity;

// serverEmoji
export type ServerEmoji = {
	shortCode: string;
	url: string;
	staticUrl: string;
	visibleInPicker?: boolean;
	timesUsed: number;
	serverId: number; //fk
	category?: string; // default=N/A
} & BaseEntity;

// serverEmojiAlias
export type ServerEmojiAlias = {
	serverEmojiId: number; // fk (composite key)
	alias: string; // (composite key)
} & BaseEntity;

// hashtag
export type Hashtag = {
	name: string; // unique
} & BaseEntity;

// accountHashtag
export type AccountHashtag = {
	followed: boolean;
	private: boolean;
	hashtagId: number | null;
	accountId: number | null;
	account?: Account;
	hashtag?: Hashtag;
} & BaseEntity;

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
} & BaseEntity;

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
} & BaseEntity;

export type Setting = {
	key: string;
	value: string;
	type: string;
} & BaseEntity;
