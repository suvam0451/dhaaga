import {
	DriverTimelineGetApiResponse,
	DhaagaJsTimelineQueryOptions,
	TimelinesRoute,
} from '../_router/routes/timelines.js';
import { DefaultTimelinesRouter } from '../default/timelines.js';
import { CasingUtil } from '../../../utils/casing.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MegalodonPleromaWrapper } from '../../../custom-clients/custom-clients.js';
import { ApiErrorCode } from '../../../types/result.types.js';

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
		try {
			const data = await this.client.client.getHomeTimeline(
				CasingUtil.snakeCaseKeys(query),
			);
			return data.data;
		} catch (e) {
			throw new Error(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	async public(
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		if (query.local === true) {
			const data = await this.client.client.getLocalTimeline(
				CasingUtil.snakeCaseKeys(query),
			);
			return data.data;
		} else {
			const data = await this.client.client.getPublicTimeline(
				CasingUtil.snakeCaseKeys(query),
			);
			return data.data;
		}
	}

	async bubble(
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		const { data: _data, error } = await this.direct.get<any[]>(
			'/api/v1/timelines/bubble',
			{
				queries: CasingUtil.snakeCaseKeys(query),
			},
		);
		if (error) throw new Error(error.code);
		return CasingUtil.camelCaseKeys(_data);
	}

	async list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		const data = await this.client.client.getListTimeline(
			q,
			CasingUtil.snakeCaseKeys(query),
		);
		return data.data;
	}

	async hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		const data = await this.client.client.getTagTimeline(
			q,
			CasingUtil.snakeCaseKeys(query),
		);
		return data.data;
	}
}
