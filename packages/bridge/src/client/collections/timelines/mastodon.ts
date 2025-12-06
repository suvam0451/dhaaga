import { DhaagaJsTimelineQueryOptions, TimelinesRoute } from './_interface.js';
import { createRestAPIClient } from 'masto';
import { MastoStatus } from '#/types/mastojs.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MastoJsWrapper } from '#/client/utils/api-wrappers.js';
import { MastoErrorHandler } from '#/client/utils/api-wrappers.js';

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

	async home(query: DhaagaJsTimelineQueryOptions): Promise<MastoStatus[]> {
		const fn = this.client.lib.v1.timelines.home.list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) throw new Error(error?.code);
		return data;
	}

	async public(query: DhaagaJsTimelineQueryOptions): Promise<MastoStatus[]> {
		const fn = this.client.lib.v1.timelines.public.list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) throw new Error(error?.code);
		return data;
	}

	async publicAsGuest(
		urlLike: string,
		query: DhaagaJsTimelineQueryOptions,
	): Promise<MastoStatus[]> {
		const anonLib = this.anonLibClient(urlLike);
		const fn = anonLib.v1.timelines.public.list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) throw new Error(error?.code);
		return data;
	}

	async hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): Promise<MastoStatus[]> {
		const fn = this.client.lib.v1.timelines.tag.$select(q).list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) throw new Error(error?.code);
		return data;
	}

	async hashtagAsGuest(
		urlLike: string,
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): Promise<MastoStatus[]> {
		const anonLib = this.anonLibClient(urlLike);
		const fn = anonLib.v1.timelines.tag.$select(q).list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) throw new Error(error?.code);
		return data;
	}

	async list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): Promise<MastoStatus[]> {
		const fn = this.client.lib.v1.timelines.list.$select(q).list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) throw new Error(error?.code);
		return data;
	}
}
