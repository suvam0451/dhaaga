import {
	DhaagaJsTimelineArrayPromise,
	DhaagaJsTimelineQueryOptions,
	TimelinesRoute,
} from '../_router/routes/timelines.js';
import { DefaultTimelinesRouter } from '../default/timelines.js';
import { CasingUtils } from '../../../utiils/casing.utils.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { MegalodonPleromaWrapper } from '../../../custom-clients/custom-clients.js';
import { DhaagaErrorCode } from '../../../types/result.types.js';

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
				CasingUtils.snakeCaseKeys(query),
			);
			return { data: data.data };
		} catch (e) {
			console.log('error is here', e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async public(
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		if (query.local === true) {
			const data = await this.client.client.getLocalTimeline(
				CasingUtils.snakeCaseKeys(query),
			);
			return { data: data.data };
		} else {
			const data = await this.client.client.getPublicTimeline(
				CasingUtils.snakeCaseKeys(query),
			);
			return { data: data.data };
		}
	}

	async bubble(
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		const { data: _data, error } = await this.direct.get<any[]>(
			'/api/v1/timelines/bubble',
			CasingUtils.snakeCaseKeys(query),
		);
		if (error) return errorBuilder(error.code);
		return { data: CasingUtils.camelCaseKeys(_data) };
	}

	async list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		const data = await this.client.client.getListTimeline(
			q,
			CasingUtils.snakeCaseKeys(query),
		);
		return { data: data.data };
	}

	async hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		const data = await this.client.client.getTagTimeline(
			q,
			CasingUtils.snakeCaseKeys(query),
		);
		return {
			data: data.data,
		};
	}
}
