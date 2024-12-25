import {
	DhaagaJsTimelineQueryOptions,
	TimelinesRoute,
} from '../_router/routes/timelines.js';
import { MastoErrorHandler } from '../_router/_runner.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { createRestAPIClient } from 'masto';
import { MastoStatus } from '../../../types/mastojs.types.js';
import { LibraryResponse } from '../../../types/result.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MastoJsWrapper } from '../../../custom-clients/custom-clients.js';

export class MastodonTimelinesRouter implements TimelinesRoute {
	direct: FetchWrapper;
	client: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MastoJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	//
	private anonLibClient(urlLike: string) {
		return createRestAPIClient({ url: urlLike });
	}

	async home(
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>> {
		const fn = this.client.lib.v1.timelines.home.list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) return errorBuilder<MastoStatus[]>(error);
		return { data: await data };
	}

	async public(
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>> {
		const fn = this.client.lib.v1.timelines.public.list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) return errorBuilder<MastoStatus[]>(error);
		return { data: await data };
	}

	async publicAsGuest(
		urlLike: string,
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>> {
		const anonLib = this.anonLibClient(urlLike);
		const fn = anonLib.v1.timelines.public.list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) return errorBuilder<MastoStatus[]>(error);
		return { data: await data };
	}

	async hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>> {
		const fn = this.client.lib.v1.timelines.tag.$select(q).list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) return errorBuilder<MastoStatus[]>(error);
		return { data: await data };
	}

	async hashtagAsGuest(
		urlLike: string,
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>> {
		const anonLib = this.anonLibClient(urlLike);
		const fn = anonLib.v1.timelines.tag.$select(q).list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) return errorBuilder<MastoStatus[]>(error);
		return { data: await data };
	}

	async list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>> {
		const fn = this.client.lib.v1.timelines.list.$select(q).list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) return errorBuilder<MastoStatus[]>(error);
		return { data: await data };
	}
}
