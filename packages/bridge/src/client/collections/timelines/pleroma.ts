import {
	DriverTimelineGetApiResponse,
	DhaagaJsTimelineQueryOptions,
	TimelinesRoute,
} from './_interface.js';
import { DefaultTimelinesRouter } from './default.js';
import { CasingUtil } from '#/utils/casing.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MegalodonPleromaWrapper } from '#/client/utils/api-wrappers.js';

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
	): DriverTimelineGetApiResponse {
		const data = await this.client.client.getHomeTimeline(
			CasingUtil.snakeCaseKeys(query),
		);
		return {
			data: data.data,
			maxId: data.data.length > 0 ? data.data[0].id : null,
		};
	}

	async public(
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		if (query.local === true) {
			const data = await this.client.client.getLocalTimeline(
				CasingUtil.snakeCaseKeys(query),
			);
			return {
				data: data.data,
				maxId: data.data.length > 0 ? data.data[0].id : null,
			};
		} else {
			const data = await this.client.client.getPublicTimeline(
				CasingUtil.snakeCaseKeys(query),
			);
			return {
				data: data.data,
				maxId: data.data.length > 0 ? data.data[0].id : null,
			};
		}
	}

	async bubble(
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		const data = await this.direct.get<any[]>('/api/v1/timelines/bubble', {
			queries: CasingUtil.snakeCaseKeys(query),
		});
		return CasingUtil.camelCaseKeys(data);
	}

	async list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		const data = await this.client.client.getListTimeline(
			q,
			CasingUtil.snakeCaseKeys(query),
		);
		return {
			data: data.data,
			maxId: data.data.length > 0 ? data.data[0].id : null,
		};
	}

	async hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		const data = await this.client.client.getTagTimeline(
			q,
			CasingUtil.snakeCaseKeys(query),
		);
		return {
			data: data.data,
			maxId: data.data.length > 0 ? data.data[0].id : null,
		};
	}
}
