import { DriverTimelineGetApiResponse, TimelinesRoute } from './_interface.js';
import type { AppBskyFeedDefs } from '@atproto/api';
import { AppAtpSessionData } from '#/types/atproto.js';
import { getBskyAgent, getXrpcAgent } from '#/utils/atproto.js';
import { PaginatedPromise } from '#/types/api-response.js';
import { DhaagaJsTimelineQueryOptions } from '#/client/typings.js';

type FeedGetQueryDto = {
	feed: string;
	limit?: number;
	cursor?: string;
};

class BlueskyTimelinesRouter implements TimelinesRoute {
	dto: AppAtpSessionData;
	constructor(dto: AppAtpSessionData) {
		this.dto = dto;
	}

	async hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): PaginatedPromise<AppBskyFeedDefs.PostView[]> {
		const agent = getBskyAgent(this.dto);
		const data = await agent.app.bsky.feed.searchPosts({
			q: q,
			limit: query.limit,
			cursor: query.maxId === null ? undefined : query.maxId,
		});
		return {
			data: data.data.posts,
			maxId: data.data.cursor,
		};
	}

	hashtagAsGuest(
		urlLike: string,
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		return Promise.resolve(undefined) as any;
	}

	async home(
		query: DhaagaJsTimelineQueryOptions,
	): PaginatedPromise<AppBskyFeedDefs.FeedViewPost[]> {
		const agent = getBskyAgent(this.dto);
		const data = await agent.getTimeline({
			limit: query.limit || 10,
			// 500 on passing null
			cursor: query.maxId === null ? undefined : query.maxId,
			// algorithm: 'reverse-chronological',
		});
		return { data: data.data.feed, maxId: data.data.cursor };
	}

	list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		return Promise.resolve(undefined) as any;
	}

	public(query: DhaagaJsTimelineQueryOptions): DriverTimelineGetApiResponse {
		return Promise.resolve(undefined) as any;
	}

	publicAsGuest(
		urlLike: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		return Promise.resolve(undefined) as any;
	}

	async getFeed(
		params: FeedGetQueryDto,
	): PaginatedPromise<AppBskyFeedDefs.FeedViewPost[]> {
		const agent = getXrpcAgent(this.dto);
		const data = await agent.app.bsky.feed.getFeed(params);
		return { data: data.data.feed, maxId: data.data.cursor };
	}

	/**
	 * Get details for a single feed
	 * @param uri uri of the feed
	 */
	async getFeedGenerator(uri: string) {
		const agent = getXrpcAgent(this.dto);
		return agent.app.bsky.feed.getFeedGenerator({ feed: uri });
	}

	/**
	 * Get details for multiple feeds
	 * @param uriList list of feed uris
	 */
	async getFeedGenerators(uriList: string[]) {
		const agent = getXrpcAgent(this.dto);
		return agent.app.bsky.feed.getFeedGenerators({ feeds: uriList });
	}
}

export default BlueskyTimelinesRouter;
