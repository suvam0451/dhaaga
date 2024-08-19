import {
	DhaagaJsTimelineArrayPromise,
	DhaagaJsTimelineQueryOptions,
	TimelinesRoute,
} from '../_router/routes/timelines.js';
import { DefaultTimelinesRouter } from '../default/timelines.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMegalodonClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { KNOWN_SOFTWARE } from '../_router/routes/instance.js';
import { toSnakeCase } from '../_router/utils/casing.utils.js';
import AppApi from '../../_api/AppApi.js';

export class PleromaTimelinesRouter
	extends DefaultTimelinesRouter
	implements TimelinesRoute
{
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MEGALODON>;

	constructor(forwarded: RestClient) {
		super();
		this.client = forwarded;
		this.lib = DhaagaMegalodonClient(
			KNOWN_SOFTWARE.PLEROMA,
			this.client.url,
			this.client.accessToken,
		);
	}

	async home(
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		const data = await this.lib.client.getHomeTimeline(toSnakeCase(query));
		return { data: data.data };
	}

	async public(
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		const data = await this.lib.client.getPublicTimeline(toSnakeCase(query));
		return { data: data.data };
	}

	async bubble(
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		const { data: _data, error } = await new AppApi(
			this.client.url,
			this.client.accessToken,
		).get('/api/v1/timelines/bubble', query);

		console.log(_data);
		return {} as any;
		// const data = await this.client;
	}

	async list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		const data = await this.lib.client.getListTimeline(q, toSnakeCase(query));
		return { data: data.data };
	}

	async hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		const data = await this.lib.client.getTagTimeline(q, toSnakeCase(query));
		return {
			data: data.data,
		};
	}
}
