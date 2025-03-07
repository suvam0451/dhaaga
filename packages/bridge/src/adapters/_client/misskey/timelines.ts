import {
	DriverTimelineGetApiResponse,
	DhaagaJsTimelineQueryOptions,
	TimelinesRoute,
} from '../_router/routes/timelines.js';
import { Endpoints } from 'misskey-js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { ApiErrorCode } from '../../../types/result.types.js';
import { MisskeyJsWrapper } from '../../../custom-clients/custom-clients.js';
import { ApiAsyncResult } from '../../../utils/api-result.js';
import { Err, Ok } from '../../../utils/index.js';

export class MisskeyTimelinesRouter implements TimelinesRoute {
	direct: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	publicAsGuest(
		urlLike: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		throw new Error('Method not implemented.');
	}

	hashtagAsGuest(
		urlLike: string,
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		throw new Error('Method not implemented.');
	}

	async home(
		query: DhaagaJsTimelineQueryOptions,
	): ApiAsyncResult<Endpoints['notes/timeline']['res']> {
		try {
			const data = await this.client.client.request('notes/timeline', {
				...query,
			});
			return Ok(data);
		} catch (e: any) {
			if (e.code) return Err(ApiErrorCode.UNAUTHORIZED);
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	/**
	 * TODO test that adding withReplies for
	 * sharkey does not break misskey/firefish
	 */
	async public(
		query: DhaagaJsTimelineQueryOptions & {
			withReplies?: boolean | null;
		},
	): ApiAsyncResult<Endpoints['notes/global-timeline']['res']> {
		if (query?.local) {
			const data = await this.client.client.request('notes/local-timeline', {
				...query,
				allowPartial: true,
				withBots: true,
				local: undefined,
			} as any);
			return Ok(data);
		}
		if (query?.social) {
			const data = await this.client.client.request(
				'notes/hybrid-timeline',
				query as any,
			);
			return Ok(data);
		} else {
			// a.k.a. -- federated timeline
			const data = await this.client.client.request(
				'notes/global-timeline',
				query,
			);
			return Ok(data);
		}
	}

	/**
	 * Limited forks support this feature
	 */
	async bubble(query: DhaagaJsTimelineQueryOptions): ApiAsyncResult<any[]> {
		try {
			const { data, error } = await this.direct.post(
				'/api/notes/bubble-timeline',
				query,
				{},
			);
			if (error) return Err(ApiErrorCode.UNKNOWN_ERROR);
			return Ok(data as any[]);
		} catch (e) {
			console.log(e);
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	async hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): ApiAsyncResult<Endpoints['notes/search-by-tag']['res']> {
		const data = await this.client.client.request<
			'notes/search-by-tag',
			Endpoints['notes/search-by-tag']['req']
		>('notes/search-by-tag', {
			tag: q,
			...query,
		});
		return Ok(data);
	}

	async list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		const data = await this.client.client.request<
			'notes/user-list-timeline',
			Endpoints['notes/user-list-timeline']['req']
		>('notes/user-list-timeline', { listId: q, ...query });
		return Ok(data);
	}
}
