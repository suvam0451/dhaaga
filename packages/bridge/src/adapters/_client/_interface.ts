import { MastoTag, MastoTrendLink } from '../../types/mastojs.types.js';

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
