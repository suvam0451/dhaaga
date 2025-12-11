import { Endpoints } from 'misskey-js';
import { AppBskyFeedDefs } from '@atproto/api';
import { MastoStatus } from '#/types/mastojs.types.js';
import { MegaStatus } from '#/types/megalodon.types.js';
import { PaginatedPromise } from '#/types/api-response.js';
import { DhaagaJsTimelineQueryOptions } from '#/client/typings.js';

export type DriverTimelineGetApiResponse = PaginatedPromise<
	| MastoStatus[]
	| MegaStatus[]
	| Endpoints['notes/timeline']['res']
	| Endpoints['notes/search-by-tag']['res']
	| Endpoints['notes/user-list-timeline']['res']
	| AppBskyFeedDefs.FeedViewPost[]
	| AppBskyFeedDefs.PostView[]
>;

export interface TimelinesRoute {
	home(query: DhaagaJsTimelineQueryOptions): DriverTimelineGetApiResponse;

	public(
		query: DhaagaJsTimelineQueryOptions & {
			withReplies?: boolean | null;
		},
	): DriverTimelineGetApiResponse;

	publicAsGuest(
		urlLike: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse;

	hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse;

	hashtagAsGuest(
		urlLike: string,
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse;

	list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse;
}
