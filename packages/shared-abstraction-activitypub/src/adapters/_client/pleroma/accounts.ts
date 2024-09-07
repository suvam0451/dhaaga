import {
	AccountRoute,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
} from '../_router/routes/accounts.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMegalodonClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { KNOWN_SOFTWARE } from '../_router/routes/instance.js';
import {
	errorBuilder,
	notImplementedErrorBuilder,
} from '../_router/dto/api-responses.dto.js';
import { BaseAccountsRouter } from '../default/accounts.js';
import {
	GetPostsQueryDTO,
	MastoAccount,
	MastoRelationship,
	MastoStatus,
	MegaAccount,
	MegaRelationship,
	MegaStatus,
} from '../_interface.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import AppApi from '../../_api/AppApi.js';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import { DhaagaErrorCode } from '../_router/_types.js';

export class PleromaAccountsRouter
	extends BaseAccountsRouter
	implements AccountRoute
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

	async get(id: string): LibraryPromise<MegaAccount> {
		const data = await this.lib.client.getAccount(id);
		if (data.status !== 200) return errorBuilder(data.statusText);
		return { data: camelcaseKeys(data.data) as any };
	}

	async lookup(webfingerUrl: string): LibraryPromise<MegaAccount> {
		const data = await this.lib.client.lookupAccount(webfingerUrl);
		if (data.status !== 200) {
			return errorBuilder(data.statusText);
		}
		return { data: data.data };
	}

	async statuses(
		id: string,
		query: AccountRouteStatusQueryDto,
	): LibraryPromise<any> {
		try {
			const data = await this.lib.client.getAccountStatuses(
				id,
				snakecaseKeys(query) as any,
			);
			return { data: camelcaseKeys(data.data, { deep: true }) };
		} catch (e) {
			console.log('[ERROR]: getting pleroma user timeline', e);
			return { data: [] };
		}
	}

	async relationships(ids: string[]): LibraryPromise<MastoRelationship[]> {
		const data = await this.lib.client.getRelationships(ids);
		if (data.status !== 200) {
			return errorBuilder<MastoRelationship[]>(data.statusText);
		}
		return { data: camelcaseKeys(data.data) as any };
	}

	async likes(opts: GetPostsQueryDTO): LibraryPromise<MegaStatus[]> {
		const data = await this.lib.client.getFavourites(opts);
		if (data.status !== 200) {
			return errorBuilder<MegaStatus[]>(data.statusText);
		}
		return { data: data.data };
	}

	async bookmarks(query: BookmarkGetQueryDTO): LibraryPromise<{
		data: MastoStatus[];
		minId?: string | null;
		maxId?: string | null;
	}> {
		// Works, but not ideal
		// const data = await this.lib.client.getBookmarks(query);
		// return {
		// 	data: {
		// 		data: data.data,
		// 		minId: null,
		// 		maxId: null,
		// 	},
		// };

		const { data: _data, error } = await new AppApi(
			this.client.url,
			this.client.accessToken,
		).getCamelCaseWithLinkPagination<MastoStatus[]>('/api/v1/bookmarks', query);

		if (!_data || error) {
			return notImplementedErrorBuilder<{
				data: MastoStatus[];
				minId: string | null;
				maxId: string | null;
			}>();
		}
		return {
			data: _data,
		};
	}

	async follow(id: string): LibraryPromise<MegaRelationship> {
		// Akkoma 400s on /follow with body
		const data = await this.lib.client.followAccount(id);
		if (data.status !== 200) {
			return errorBuilder(data.statusText);
		}
		// console.log(data, error);
		return { data: camelcaseKeys(data.data as any) as any };
	}

	async unfollow(id: string): LibraryPromise<MegaRelationship> {
		const data = await this.lib.client.unfollowAccount(id);
		if (data.status !== 200) {
			return errorBuilder(data.statusText);
		}
		return { data: camelcaseKeys(data.data) as any };
	}

	async followers(query: FollowerGetQueryDTO): LibraryPromise<{
		data: MastoAccount[];
		minId?: string | null;
		maxId?: string | null;
	}> {
		try {
			const { id, ...rest } = query;
			const { data: _data, error } = await new AppApi(
				this.client.url,
				this.client.accessToken,
			).getCamelCaseWithLinkPagination<MastoAccount[]>(
				`/api/v1/accounts/${id}/followers`,
				rest,
			);

			if (error) {
				return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
			}
			return { data: _data };
		} catch (e) {
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async followings(query: FollowerGetQueryDTO): LibraryPromise<{
		data: MastoAccount[];
		minId?: string | null;
		maxId?: string | null;
	}> {
		try {
			const { id, ...rest } = query;
			const { data: _data, error } = await new AppApi(
				this.client.url,
				this.client.accessToken,
			).getCamelCaseWithLinkPagination<MastoAccount[]>(
				`/api/v1/accounts/${id}/following`,
				rest,
			);

			if (error) {
				return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
			}
			return { data: _data };
		} catch (e) {
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}
}
