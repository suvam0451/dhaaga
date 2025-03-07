import {
	DhaagaJsTimelineQueryOptions,
	TimelinesRoute,
} from '../_router/routes/timelines.js';
import { MastoErrorHandler } from '../_router/_runner.js';
import { createRestAPIClient } from 'masto';
import { MastoStatus } from '../../../types/mastojs.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MastoJsWrapper } from '../../../custom-clients/custom-clients.js';
import { ApiAsyncResult } from '../../../utils/api-result.js';
import { Err, Ok } from '../../../utils/index.js';

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
	): ApiAsyncResult<MastoStatus[]> {
		const fn = this.client.lib.v1.timelines.home.list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) return Err(error?.code);
		return Ok(await data);
	}

	async public(
		query: DhaagaJsTimelineQueryOptions,
	): ApiAsyncResult<MastoStatus[]> {
		const fn = this.client.lib.v1.timelines.public.list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) return Err(error?.code);
		return Ok(await data);
	}

	async publicAsGuest(
		urlLike: string,
		query: DhaagaJsTimelineQueryOptions,
	): ApiAsyncResult<MastoStatus[]> {
		const anonLib = this.anonLibClient(urlLike);
		const fn = anonLib.v1.timelines.public.list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) return Err(error?.code);
		return Ok(await data);
	}

	async hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): ApiAsyncResult<MastoStatus[]> {
		const fn = this.client.lib.v1.timelines.tag.$select(q).list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) return Err(error?.code);
		return Ok(await data);
	}

	async hashtagAsGuest(
		urlLike: string,
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): ApiAsyncResult<MastoStatus[]> {
		const anonLib = this.anonLibClient(urlLike);
		const fn = anonLib.v1.timelines.tag.$select(q).list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) return Err(error?.code);
		return Ok(await data);
	}

	async list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): ApiAsyncResult<MastoStatus[]> {
		const fn = this.client.lib.v1.timelines.list.$select(q).list;
		const { data, error } = await MastoErrorHandler(fn, [query]);
		if (error || !data) return Err(error?.code);
		return Ok(await data);
	}
}
