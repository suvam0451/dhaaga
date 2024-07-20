import { LibraryResponse } from '../_router/_types.js';
import {
	DhaagaJsTimelineQueryOptions,
	TimelinesRoute,
} from '../_router/routes/timelines.js';
import { MastoStatus } from '../_interface.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMastoClient,
	DhaagaRestClient,
	MastoErrorHandler,
} from '../_router/_runner.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { createRestAPIClient } from 'masto';

export class MastodonTimelinesRouter implements TimelinesRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MASTOJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMastoClient(this.client.url, this.client.accessToken);
	}

	//
	private anonLibClient(urlLike: string) {
		return createRestAPIClient({ url: urlLike });
	}

	async home(
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>> {
		const fn = this.lib.client.v1.timelines.home.list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) return errorBuilder<MastoStatus[]>(error);
		return { data: await data };
	}

	async public(
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>> {
		const fn = this.lib.client.v1.timelines.public.list;
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
		const fn = this.lib.client.v1.timelines.tag.$select(q).list;
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
		const fn = this.lib.client.v1.timelines.list.$select(q).list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) return errorBuilder<MastoStatus[]>(error);
		return { data: await data };
	}
}
