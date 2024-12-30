import {
	DhaagaJsTimelineArrayPromise,
	DhaagaJsTimelineQueryOptions,
	TimelinesRoute,
} from '../_router/routes/timelines.js';
import { DefaultTimelinesRouter } from '../default/timelines.js';
import { toSnakeCase } from '../_router/utils/casing.utils.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { MegalodonPleromaWrapper } from '../../../custom-clients/custom-clients.js';

export class PleromaTimelinesRouter
	extends DefaultTimelinesRouter
	implements TimelinesRoute
{
	direct: FetchWrapper;
	client: MegalodonPleromaWrapper;

	constructor(forwarded: FetchWrapper) {
		super();
		this.direct = forwarded;
		this.client = MegalodonPleromaWrapper.create(
			forwarded.baseUrl,
			forwarded.token,
		);
	}

	async home(
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		const data = await this.client.client.getHomeTimeline(toSnakeCase(query));
		return { data: data.data };
	}

	async public(
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		if (query.local === true) {
			const data = await this.client.client.getLocalTimeline(
				toSnakeCase(query),
			);
			return { data: data.data };
		} else {
			const data = await this.client.client.getPublicTimeline(
				toSnakeCase(query),
			);
			return { data: data.data };
		}
	}

	async bubble(
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		const { data: _data, error } = await this.direct.get<any[]>(
			'/api/v1/timelines/bubble',
			snakecaseKeys(query),
		);
		if (error) return errorBuilder(error.code);
		return { data: camelcaseKeys(_data as any, { deep: true }) };
	}

	async list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		const data = await this.client.client.getListTimeline(
			q,
			toSnakeCase(query),
		);
		return { data: data.data };
	}

	async hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		const data = await this.client.client.getTagTimeline(q, toSnakeCase(query));
		return {
			data: data.data,
		};
	}
}
