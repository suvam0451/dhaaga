import { MastoTag, MastoTrendLink } from '#/types/mastojs.types.js';
import type { DriverNotificationType } from '#/client/utils/driver.js';
import { Endpoints } from 'misskey-js';

export type HashtagTimelineQuery = {
	limit: number;
	sinceId?: string;
	maxId?: string;
	minId?: string;
	any?: string[];
	all?: string[];
	none?: string[];
	onlyMedia?: boolean;
};

export type GetUserPostsQueryDTO = {
	limit: number;
	maxId?: string;
	excludeReplies: boolean;
};

export type GetPostsQueryDTO = {
	limit: number;
	sinceId?: string;
	minId?: string;
	maxId?: string;
};

export type GetTimelineQueryDTO = {
	limit: number;
	sinceId?: string;
	minId?: string;
	maxId?: string;
	remote?: boolean;
	local?: boolean;
	onlyMedia?: boolean;
};

export type GetTrendingDTO = {
	limit: number;
	offset?: number;
};

export type GetSearchResultQueryDTO = {
	type: 'accounts' | 'hashtags' | 'statuses' | null | undefined;
	following: boolean;
	limit: number;
	maxId?: string;
};

export type RestClientCreateDTO = {
	instance: string;
	token: string;
	/**
	 * a unique identifier to help trigger react hooks
	 * and reset all pages when the api client
	 * changes
	 */
	clientId: number | string;
};

export type Tag = MastoTag | null | undefined;
export type TagArray = MastoTag[] | [];

export type TrendLinkArray = MastoTrendLink[] | [];

export type MediaUploadDTO = {
	readonly file: Blob | string;
	readonly description?: string | null;
	readonly focus?: string | null;
	readonly thumbnail?: Blob | string | null;
	readonly skipPolling?: boolean;
};

export type FollowPostDto = {
	reblogs: boolean;
	notify: boolean;
	// (ISO 639-1 language two-letter code)
	languages?: string[];
	// misskey, default false
	withReplies?: boolean;
};

type __MisskeyTimelineOptions = {
	// common
	limit?: number;
	sinceId?: string;
	untilId?: string;
	sinceDate?: number;
	untilDate?: number;

	allowPartial?: boolean;
	includeMyRenotes?: boolean;
	includeRenotedMyNotes?: boolean;
	includeLocalRenotes?: boolean;
	withFiles?: boolean; // public, tags
	withRenotes?: boolean; // public

	// tag only
	renote?: boolean;
	poll?: boolean;
	reply?: boolean;
	// query?: string[][] // wtf is this???
};

/**
 *
 * Pleroma/Akkoma + Home = Local only
 * Pleroma/Akkoma + Public = "Only Media" only
 */
export type DhaagaJsTimelineQueryOptions = {
	limit: number;
	sinceId?: string;
	maxId?: string;
	minId?: string;

	// most timelines
	onlyMedia?: boolean;

	// public timeline
	remote?: boolean;
	local?: boolean;
	social?: boolean; // bootstrap for "Social" timeline

	// hashtag only
	any?: string[];
	all?: string[];
	none?: string[];

	// user statuses
	pinned?: boolean | null;
	excludeReplies?: boolean | null;
	excludeReblogs?: boolean | null;
	tagged?: string | null;

	// Akkoma specific thing?
	withMuted?: boolean;

	// (Only usable on local timeline + Sharkey)
	// withReplies?: boolean | null;
} & __MisskeyTimelineOptions;
type MastoUnifiedSearchType = {
	q: string;
	following?: boolean;
	type?: 'accounts' | 'hashtags' | 'statuses';
	resolve?: boolean;
	offset?: number;
	minId?: string;
	maxId?: string;
	accountId?: string;
};
type DhaagaJsUserSearchDTO = {
	origin?: 'combined' | 'local' | 'remote';
	allowPartial?: boolean;
	limit: number;
	query: string;
	untilId?: string;
} & MastoUnifiedSearchType;
type DhaagaJsPostSearchDTO = {
	sort?: string;
	allowPartial?: true;
	filetype?: null | 'image' | 'video' | 'audio';
	limit: number;
	order?: 'asc' | 'desc';
	host?: string; // "." for local
	query: string;
	userId?: null;
	sinceId?: string;
	untilId?: string;
} & MastoUnifiedSearchType;
export { DhaagaJsPostSearchDTO };
export { DhaagaJsUserSearchDTO };
export { MastoUnifiedSearchType };
export type DhaagaJsPostCreateDto = {
	inReplyToId: null | string;
	language: string;
	mediaIds: string[];
	poll?: any;
	sensitive: boolean;
	spoilerText?: string;
	status: string;
	mastoVisibility?: 'direct' | 'public' | 'unlisted' | 'private';

	// misskey
	misskeyVisibility?: 'public' | 'home' | 'followers' | 'specified';
	visibleUserIds?: string[];

	// cw?: string | null
	localOnly: boolean;
	reactionAcceptance?:
		| null
		| 'likeOnly'
		| 'likeOnlyForRemote'
		| 'nonSensitiveOnly'
		| 'nonSensitiveOnlyForLocalLikeOnlyForRemote'; // lang: string;
	// replyId?: string | null;
	// renoteId?: string | null;
	// channelId?: string | null;
	// text?: string | null;

	// what do these evn do ???
	// noExtractMentions?: boolean;
	// noExtractHashtags?: boolean;
	// noExtractEmojis?: boolean;
};
export type NotificationGetQueryDto = {
	limit: number;
	minId?: string;
	maxId?: string; // doubles as untilId for misskey
	accountId?: string; // restrict to notifications received from this account
	types?: DriverNotificationType[];
	excludeTypes?: DriverNotificationType[];
	markAsRead?: boolean; // misskey
	excludeType?: string[];
	includeType?: string[];
};
export type DhaagaJsMediaCreateDTO = {
	file: Blob;
	filename?: string;
	force: boolean;
	uri: string;
	name: string;
	type: string;
};
export type SubscriptionUpdateResult = Promise<{
	success: boolean;
	subscribed: boolean;
}>;
export type PinStatusUpdateResult = Promise<{
	success: boolean;
	pinned: boolean;
}>;
export type BookmarkGetQueryDTO = {
	limit: number;
	maxId?: string;
	minId?: string;
};
export type FollowerGetQueryDTO = {
	allowPartial: boolean;
	limit: number;
	id: string;
	maxId: string | null;
};
type DefaultPaginationParams = {
	// masto.js
	readonly maxId?: string | null;
	readonly sinceId?: string | null;
	readonly minId?: string | null;
	readonly limit?: number | null;
};
type ListAccountStatusesParams = DefaultPaginationParams & {
	// masto.js
	readonly onlyMedia?: boolean | null;
	readonly pinned?: boolean | null;
	readonly excludeReplies?: boolean | null;
	readonly excludeReblogs?: boolean | null;
	readonly tagged?: string | null;
};
export type AccountRouteStatusQueryDto = ListAccountStatusesParams &
	Endpoints['users/notes']['req'] & {
		bskyFilter?: 'posts_with_media';
	};
export type AccountMutePostDto = {
	notifications: boolean;
	duration: number;
};
