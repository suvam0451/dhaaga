import {
	DhaagaJsTimelineArrayPromise,
	DhaagaJsTimelineQueryOptions,
	TimelinesRoute,
} from '../_router/routes/timelines.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMisskeyClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { Endpoints } from 'misskey-js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { DhaagaErrorCode } from '../_router/_types.js';
import AppApi from '../../_api/AppApi.js';

export class MisskeyTimelinesRouter implements TimelinesRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MISSKEYJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMisskeyClient(this.client.url, this.client.accessToken);
	}

	publicAsGuest(
		urlLike: string,
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		throw new Error('Method not implemented.');
	}

	hashtagAsGuest(
		urlLike: string,
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): DhaagaJsTimelineArrayPromise {
		throw new Error('Method not implemented.');
	}

	async home(
		query: DhaagaJsTimelineQueryOptions,
	): LibraryPromise<Endpoints['notes/timeline']['res']> {
		try {
			const data = await this.lib.client.request('notes/timeline', {
				...query,
			});
			return { data };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(DhaagaErrorCode.UNAUTHORIZED);
			}
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
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
	): LibraryPromise<Endpoints['notes/global-timeline']['res']> {
		if (query?.local) {
			const data = await this.lib.client.request(
				'notes/local-timeline',
				query as any,
			);
			return { data };
		}
		if (query?.social) {
			const data = await this.lib.client.request(
				'notes/hybrid-timeline',
				query as any,
			);
			return { data };
		} else {
			// a.k.a. -- federated timeline
			const data = await this.lib.client.request(
				'notes/global-timeline',
				query,
			);
			return { data };
		}
	}

	/**
	 * Limited forks support this feature
	 */
	async bubble(query: DhaagaJsTimelineQueryOptions) {
		try {
			const { data, error } = await new AppApi(
				this.client.url,
				this.client.accessToken,
			).post('/api/notes/bubble-timeline', query, {});
			if (error) return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
			return { data };
		} catch (e) {
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): LibraryPromise<Endpoints['notes/search-by-tag']['res']> {
		const data = await this.lib.client.request<
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
	): DhaagaJsTimelineArrayPromise {
		const data = await this.lib.client.request<
			'notes/user-list-timeline',
			Endpoints['notes/user-list-timeline']['req']
		>('notes/user-list-timeline', { listId: q, ...query });
		return { data };
	}
}
