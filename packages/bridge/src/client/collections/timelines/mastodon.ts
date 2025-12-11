import { TimelinesRoute } from './_interface.js';
import { createRestAPIClient } from 'masto';
import { MastoStatus } from '#/types/mastojs.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MastoJsWrapper } from '#/client/utils/api-wrappers.js';
import { PaginatedPromise } from '#/types/api-response.js';
import { DhaagaJsTimelineQueryOptions } from '#/client/typings.js';

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
	): PaginatedPromise<MastoStatus[]> {
		const data = await this.client.lib.v1.timelines.home.list(query);
		return { data };
	}

	async public(
		query: DhaagaJsTimelineQueryOptions,
	): PaginatedPromise<MastoStatus[]> {
		const data = await this.client.lib.v1.timelines.public.list(query);
		return { data };
	}

	async publicAsGuest(
		urlLike: string,
		query: DhaagaJsTimelineQueryOptions,
	): PaginatedPromise<MastoStatus[]> {
		const anonLib = this.anonLibClient(urlLike);
		const data = await anonLib.v1.timelines.public.list(query);
		return { data };
	}

	async hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): PaginatedPromise<MastoStatus[]> {
		const data = await this.client.lib.v1.timelines.tag.$select(q).list(query);
		return { data };
	}

	async hashtagAsGuest(
		urlLike: string,
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): PaginatedPromise<MastoStatus[]> {
		const anonLib = this.anonLibClient(urlLike);
		const data = await anonLib.v1.timelines.tag.$select(q).list(query);
		return { data };
	}

	async list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): PaginatedPromise<MastoStatus[]> {
		const data = await this.client.lib.v1.timelines.list.$select(q).list();
		return { data };
	}
}
