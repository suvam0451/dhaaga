import {
	AccountRoute,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
} from '../_router/routes/accounts.js';
import {
	errorBuilder,
	notImplementedErrorBuilder,
} from '../_router/dto/api-responses.dto.js';
import { BaseAccountsRouter } from '../default/accounts.js';
import { GetPostsQueryDTO } from '../_interface.js';
import {
	LibraryPromise,
	PaginatedLibraryPromise,
} from '../_router/routes/_types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import type {
	MastoAccount,
	MastoStatus,
} from '../../../types/mastojs.types.js';
import type {
	MegaAccount,
	MegaRelationship,
	MegaStatus,
} from '../../../types/megalodon.types.js';
import { DhaagaErrorCode } from '../../../types/result.types.js';
import { MegalodonPleromaWrapper } from '../../../custom-clients/custom-clients.js';
import { CasingUtil } from '../../../utils/casing.js';

export class PleromaAccountsRouter
	extends BaseAccountsRouter
	implements AccountRoute
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

	async get(id: string): LibraryPromise<MegaAccount> {
		const data = await this.client.client.getAccount(id);
		if (data.status !== 200) return errorBuilder(data.statusText);
		return { data: CasingUtil.camelCaseKeys(data.data) };
	}

	async lookup(webfingerUrl: string): LibraryPromise<MegaAccount> {
		const data = await this.client.client.lookupAccount(webfingerUrl);
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
			const data = await this.client.client.getAccountStatuses(
				id,
				CasingUtil.snakeCaseKeys(query) as any,
			);
			return { data: CasingUtil.camelCaseKeys(data.data) };
		} catch (e) {
			console.log('[ERROR]: getting pleroma user timeline', e);
			return { data: [] };
		}
	}

	async relationships(ids: string[]): LibraryPromise<MegaRelationship[]> {
		const data = await this.client.client.getRelationships(ids);
		if (data.status !== 200) {
			return errorBuilder<MegaRelationship[]>(data.statusText);
		}
		return { data: CasingUtil.camelCaseKeys(data.data) };
	}

	async likes(query: GetPostsQueryDTO): PaginatedLibraryPromise<MegaStatus[]> {
		// NOTE: do not use Megalodon
		// const data = await this.client.client.getFavourites(opts);
		// if (data.status !== 200) {
		// 	return errorBuilder<MegaStatus[]>(data.statusText);
		// }
		// return { data: data.data };

		const { data: _data, error } =
			await this.direct.getCamelCaseWithLinkPagination<MegaStatus[]>(
				'/api/v1/favourites',
				query,
			);

		if (!_data || error) {
			return notImplementedErrorBuilder<{
				data: MegaStatus[];
				minId: string | null;
				maxId: string | null;
			}>();
		}
		return {
			data: _data,
		};
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

		const { data: _data, error } =
			await this.direct.getCamelCaseWithLinkPagination<MastoStatus[]>(
				'/api/v1/bookmarks',
				query,
			);

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
		const data = await this.client.client.followAccount(id);
		if (data.status !== 200) {
			return errorBuilder(data.statusText);
		}
		// console.log(data, error);
		return { data: CasingUtil.camelCaseKeys(data.data) };
	}

	async unfollow(id: string): LibraryPromise<MegaRelationship> {
		const data = await this.client.client.unfollowAccount(id);
		if (data.status !== 200) {
			return errorBuilder(data.statusText);
		}
		return { data: CasingUtil.camelCaseKeys(data.data) };
	}

	async followers(query: FollowerGetQueryDTO): LibraryPromise<{
		data: MastoAccount[];
		minId?: string | null;
		maxId?: string | null;
	}> {
		try {
			const { id, ...rest } = query;
			const { data: _data, error } =
				await this.direct.getCamelCaseWithLinkPagination<MastoAccount[]>(
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
			const { data: _data, error } =
				await this.direct.getCamelCaseWithLinkPagination<MastoAccount[]>(
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
