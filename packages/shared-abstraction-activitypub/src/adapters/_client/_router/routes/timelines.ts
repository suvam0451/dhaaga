import { LibraryPromise } from './_types.js';
import { Endpoints } from 'misskey-js';
import { AppBskyFeedGetTimeline } from '@atproto/api';
import { MastoStatus } from '../../../../types/mastojs.types.js';
import { MegaStatus } from '../../../../types/megalodon.types.js';

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

export type DhaagaJsTimelineArrayPromise = LibraryPromise<
	| MastoStatus[]
	| MegaStatus[]
	| Endpoints['notes/timeline']['res']
	| Endpoints['notes/search-by-tag']['res']
	| Endpoints['notes/user-list-timeline']['res']
	| AppBskyFeedGetTimeline.Response
>;

export interface TimelinesRoute {
	home(query: DhaagaJsTimelineQueryOptions): DhaagaJsTimelineArrayPromise;

	public(
		query: DhaagaJsTimelineQueryOptions & {
			withReplies?: boolean | null;
		},
	): DhaagaJsTimelineArrayPromise;

	publicAsGuest(
		urlLike: string,
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise;

	hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise;

	hashtagAsGuest(
		urlLike: string,
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise;

	list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise;
}
