import { DriverTimelineGetApiResponse, TimelinesRoute } from './_interface.js';
import { Endpoints } from 'misskey-js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MisskeyJsWrapper } from '#/client/utils/api-wrappers.js';
import { PaginatedPromise } from '#/types/api-response.js';
import { DhaagaJsTimelineQueryOptions } from '#/client/typings.js';

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
	): PaginatedPromise<Endpoints['notes/timeline']['res']> {
		const data = await this.client.client.request('notes/timeline', {
			...query,
		});
		return {
			data: data,
			maxId: data.length > 0 ? data[data.length - 1].id : null,
		};
	}

	/**
	 * TODO test that adding withReplies for
	 * sharkey does not break misskey/firefish
	 */
	async public(
		query: DhaagaJsTimelineQueryOptions & {
			withReplies?: boolean | null;
		},
	): PaginatedPromise<Endpoints['notes/global-timeline']['res']> {
		if (query?.local) {
			const data = await this.client.client.request('notes/local-timeline', {
				...query,
				allowPartial: true,
				withBots: true,
				local: undefined,
			} as any);
			return { data, maxId: data.length > 0 ? data[data.length - 1].id : null };
		}
		if (query?.social) {
			const data = await this.client.client.request(
				'notes/hybrid-timeline',
				query as any,
			);
			return { data, maxId: data.length > 0 ? data[data.length - 1].id : null };
		} else {
			// a.k.a. -- federated timeline
			const data = await this.client.client.request(
				'notes/global-timeline',
				query,
			);
			return { data, maxId: data.length > 0 ? data[data.length - 1].id : null };
		}
	}

	/**
	 * Limited forks support this feature
	 */
	async bubble(query: DhaagaJsTimelineQueryOptions): Promise<any[]> {
		return this.direct.post('/api/notes/bubble-timeline', query, {});
	}

	async hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): PaginatedPromise<Endpoints['notes/search-by-tag']['res']> {
		const data = await this.client.client.request<
			'notes/search-by-tag',
			Endpoints['notes/search-by-tag']['req']
		>('notes/search-by-tag', {
			tag: q,
			...query,
		});
		return { data };
	}

	async list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DriverTimelineGetApiResponse {
		const data = await this.client.client.request<
			'notes/user-list-timeline',
			Endpoints['notes/user-list-timeline']['req']
		>('notes/user-list-timeline', { listId: q, ...query });
		return { data };
	}
}
