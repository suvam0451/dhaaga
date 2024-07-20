import { LibraryResponse } from '../_router/_types.js';
import {
	DhaagaJsTimelineQueryOptions,
	TimelinesRoute,
} from '../_router/routes/timelines.js';
import { MastoStatus } from '../_interface.js';

export class DefaultTimelinesRouter implements TimelinesRoute {
	home(
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>> {
		throw new Error('Method not implemented.');
	}

	public(
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>> {
		throw new Error('Method not implemented.');
	}

	publicAsGuest(
		urlLike: string,
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>> {
		throw new Error('Method not implemented.');
	}

	hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>> {
		throw new Error('Method not implemented.');
	}

	hashtagAsGuest(
		urlLike: string,
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>> {
		throw new Error('Method not implemented.');
	}

	list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>> {
		throw new Error('Method not implemented.');
	}
}
