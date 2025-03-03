import {
	DriverTimelineGetApiResponse,
	DhaagaJsTimelineQueryOptions,
	TimelinesRoute,
} from '../_router/routes/timelines.js';

export class DefaultTimelinesRouter implements TimelinesRoute {
	home(query: DhaagaJsTimelineQueryOptions): DriverTimelineGetApiResponse {
		throw new Error('Method not implemented.');
	}

	public(query: DhaagaJsTimelineQueryOptions): DriverTimelineGetApiResponse {
		throw new Error('Method not implemented.');
	}

	publicAsGuest(
		urlLike: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		throw new Error('Method not implemented.');
	}

	hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		throw new Error('Method not implemented.');
	}

	hashtagAsGuest(
		urlLike: string,
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		throw new Error('Method not implemented.');
	}

	list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		throw new Error('Method not implemented.');
	}
}
