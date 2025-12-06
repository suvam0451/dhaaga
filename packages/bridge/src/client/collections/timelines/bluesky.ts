import {
	DriverTimelineGetApiResponse,
	DhaagaJsTimelineQueryOptions,
	TimelinesRoute,
} from './_interface.js';
import { AppBskyFeedGetTimeline, AppBskyFeedSearchPosts } from '@atproto/api';
import { AppAtpSessionData } from '#/types/atproto.js';
import { ApiErrorCode } from '#/types/result.types.js';
import { getBskyAgent, getXrpcAgent } from '#/utils/atproto.js';

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
	): Promise<AppBskyFeedSearchPosts.OutputSchema> {
		const agent = getBskyAgent(this.dto);
		const data = await agent.app.bsky.feed.searchPosts({
			q: q,
			limit: query.limit,
			cursor: query.maxId === null ? undefined : query.maxId,
		});
		return data.data;
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
	): Promise<AppBskyFeedGetTimeline.Response> {
		const agent = getBskyAgent(this.dto);
		try {
			return await agent.getTimeline({
				limit: query.limit || 10,
				// 500 on passing null
				cursor: query.maxId === null ? undefined : query.maxId,
				algorithm: 'reverse-chronological',
			});
		} catch (e) {
			console.log('[ERROR]: bluesky', e);
			throw new Error(ApiErrorCode.UNKNOWN_ERROR);
		}
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

	async feed(params: FeedGetQueryDto) {
		const agent = getXrpcAgent(this.dto);
		return agent.app.bsky.feed.getFeed(params);
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
