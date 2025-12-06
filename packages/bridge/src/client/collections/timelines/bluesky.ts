import {
	DriverTimelineGetApiResponse,
	DhaagaJsTimelineQueryOptions,
	TimelinesRoute,
} from './_interface.js';
import {
	AppBskyFeedGetFeed,
	AppBskyFeedGetFeedGenerator,
	AppBskyFeedGetFeedGenerators,
	AppBskyFeedGetTimeline,
	AppBskyFeedSearchPosts,
} from '@atproto/api';
import {
	InvokeBskyFunction,
	InvokeBskyFunction_Improved,
} from '#/client/utils/custom-bsky-agent.js';
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

		return InvokeBskyFunction_Improved<AppBskyFeedSearchPosts.OutputSchema>(
			'searchPosts',
			agent.app.bsky.feed.searchPosts,
			agent.app.bsky.feed,
			{
				q: q,
				limit: 10,
				cursor: query.maxId === null ? undefined : query.maxId,
			},
		);
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
		return InvokeBskyFunction<AppBskyFeedGetFeed.OutputSchema>(
			'getFeed',
			agent.app.bsky.feed.getFeed,
			agent.app.bsky.feed,
			params,
		);
	}

	/**
	 * Get details for a single feed
	 * @param uri uri of the feed
	 */
	async getFeedGenerator(uri: string) {
		const agent = getXrpcAgent(this.dto);
		return InvokeBskyFunction<AppBskyFeedGetFeedGenerator.OutputSchema>(
			'getFeedGenerator',
			agent.app.bsky.feed.getFeedGenerator,
			agent.app.bsky.feed,
			{
				feed: uri,
			},
		);
	}

	/**
	 * Get details for multiple feeds
	 * @param uriList list of feed uris
	 */
	async getFeedGenerators(uriList: string[]) {
		const agent = getXrpcAgent(this.dto);
		return InvokeBskyFunction<AppBskyFeedGetFeedGenerators.OutputSchema>(
			'getFeedGenerator',
			agent.app.bsky.feed.getFeedGenerators,
			agent.app.bsky.feed,
			{
				feed: uriList,
			},
		);
	}
}

export default BlueskyTimelinesRouter;
