import {
	DhaagaJsTimelineArrayPromise,
	DhaagaJsTimelineQueryOptions,
	TimelinesRoute,
} from '../_router/routes/timelines.js';
import { AppBskyFeedGetTimeline, AtpSessionData } from '@atproto/api';
import { LibraryPromise } from '../_router/routes/_types.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { getBskyAgent } from '../_router/_api.js';

class BlueskyTimelinesRouter implements TimelinesRoute {
	dto: AtpSessionData;
	constructor(dto: AtpSessionData) {
		this.dto = dto;
	}

	hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		return Promise.resolve(undefined) as any;
	}

	hashtagAsGuest(
		urlLike: string,
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		return Promise.resolve(undefined) as any;
	}

	async home(
		query: DhaagaJsTimelineQueryOptions,
	): LibraryPromise<AppBskyFeedGetTimeline.Response> {
		const agent = getBskyAgent(this.dto);
		try {
			const data = await agent.getTimeline({
				limit: query.limit || 10,
				// 500 on passing null
				cursor: query.maxId === null ? undefined : query.maxId,
				algorithm: 'reverse-chronological',
			});
			return { data };
		} catch (e) {
			console.log('[ERROR]: bluesky', e);
			return errorBuilder();
		}
	}

	list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		return Promise.resolve(undefined) as any;
	}

	public(query: DhaagaJsTimelineQueryOptions): DhaagaJsTimelineArrayPromise {
		return Promise.resolve(undefined) as any;
	}

	publicAsGuest(
		urlLike: string,
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		return Promise.resolve(undefined) as any;
	}
}

export default BlueskyTimelinesRouter;
