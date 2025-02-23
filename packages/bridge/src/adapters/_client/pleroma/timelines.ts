import {
	DhaagaJsTimelineArrayPromise,
	DhaagaJsTimelineQueryOptions,
	TimelinesRoute,
} from '../_router/routes/timelines.js';
import { DefaultTimelinesRouter } from '../default/timelines.js';
import { CasingUtil } from '../../../utils/casing.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
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
	): DhaagaJsTimelineArrayPromise {
		try {
			const data = await this.client.client.getHomeTimeline(
				CasingUtil.snakeCaseKeys(query),
			);
			return { data: data.data };
		} catch (e) {
			console.log('error is here', e);
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	async public(
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		if (query.local === true) {
			const data = await this.client.client.getLocalTimeline(
				CasingUtil.snakeCaseKeys(query),
			);
			return { data: data.data };
		} else {
			const data = await this.client.client.getPublicTimeline(
				CasingUtil.snakeCaseKeys(query),
			);
			return { data: data.data };
		}
	}

	async bubble(
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		const { data: _data, error } = await this.direct.get<any[]>(
			'/api/v1/timelines/bubble',
			CasingUtil.snakeCaseKeys(query),
		);
		if (error) return errorBuilder(error.code);
		return { data: CasingUtil.camelCaseKeys(_data) };
	}

	async list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		const data = await this.client.client.getListTimeline(
			q,
			CasingUtil.snakeCaseKeys(query),
		);
		return { data: data.data };
	}

	async hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		const data = await this.client.client.getTagTimeline(
			q,
			CasingUtil.snakeCaseKeys(query),
		);
		return {
			data: data.data,
		};
	}
}
