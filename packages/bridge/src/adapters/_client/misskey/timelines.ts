import {
	DhaagaJsTimelineQueryOptions,
	DriverTimelineGetApiResponse,
	TimelinesRoute,
} from '../_router/routes/timelines.js';
import { Endpoints } from 'misskey-js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { ApiErrorCode } from '../../../types/result.types.js';
import { MisskeyJsWrapper } from '../../../custom-clients/custom-clients.js';

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
	): Promise<Endpoints['notes/timeline']['res']> {
		try {
			return await this.client.client.request('notes/timeline', {
				...query,
			});
		} catch (e: any) {
			if (e.code) throw new Error(ApiErrorCode.UNAUTHORIZED);
			throw new Error(ApiErrorCode.UNKNOWN_ERROR);
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
	): Promise<Endpoints['notes/global-timeline']['res']> {
		if (query?.local) {
			return await this.client.client.request('notes/local-timeline', {
				...query,
				allowPartial: true,
				withBots: true,
				local: undefined,
			} as any);
		}
		if (query?.social) {
			return await this.client.client.request(
				'notes/hybrid-timeline',
				query as any,
			);
		} else {
			// a.k.a. -- federated timeline
			return await this.client.client.request('notes/global-timeline', query);
		}
	}

	/**
	 * Limited forks support this feature
	 */
	async bubble(query: DhaagaJsTimelineQueryOptions): Promise<any[]> {
		const { data, error } = await this.direct.post(
			'/api/notes/bubble-timeline',
			query,
			{},
		);
		if (error) throw new Error(ApiErrorCode.UNKNOWN_ERROR);
		return data as any[];
	}

	async hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): Promise<Endpoints['notes/search-by-tag']['res']> {
		return await this.client.client.request<
			'notes/search-by-tag',
			Endpoints['notes/search-by-tag']['req']
		>('notes/search-by-tag', {
			tag: q,
			...query,
		});
	}

	async list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		return await this.client.client.request<
			'notes/user-list-timeline',
			Endpoints['notes/user-list-timeline']['req']
		>('notes/user-list-timeline', { listId: q, ...query });
	}
}
