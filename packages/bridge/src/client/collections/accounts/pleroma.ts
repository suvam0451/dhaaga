import {
	AccountRoute,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
} from './_interface.js';
import { BaseAccountsRouter } from './default.js';
import { GetPostsQueryDTO } from '../../types/_interface.js';
import FetchWrapper from '#/client/utils/fetch.js';
import type { MastoAccount, MastoStatus } from '#/types/mastojs.types.js';
import type {
	MegaAccount,
	MegaRelationship,
	MegaStatus,
} from '#/types/megalodon.types.js';
import { MegalodonPleromaWrapper } from '#/client/utils/api-wrappers.js';
import { CasingUtil } from '#/utils/casing.js';
import { DriverWebfingerType } from '#/types/query.types.js';
import { errorBuilder, LibraryPromise } from '#/types/index.js';
import { PaginatedPromise } from '#/types/api-response.js';

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

	async get(id: string): Promise<MegaAccount> {
		const data = await this.client.client.getAccount(id);
		return CasingUtil.camelCaseKeys(data.data);
	}

	async lookup(webfinger: DriverWebfingerType): Promise<MegaAccount> {
		const data = await this.client.client.lookupAccount(
			webfinger.host
				? `${webfinger.username}@${webfinger.host}`
				: webfinger.username,
		);
		if (data.status !== 200) throw new Error(data.statusText);
		return data.data;
	}

	async statuses(id: string, query: AccountRouteStatusQueryDto): Promise<any> {
		try {
			const data = await this.client.client.getAccountStatuses(
				id,
				CasingUtil.snakeCaseKeys(query) as any,
			);
			return CasingUtil.camelCaseKeys(data.data);
		} catch (e: any) {
			throw new Error(e);
		}
	}

	async relationships(ids: string[]): Promise<MegaRelationship[]> {
		const data = await this.client.client.getRelationships(ids);
		return CasingUtil.camelCaseKeys(data.data);
	}

	async likes(query: GetPostsQueryDTO): PaginatedPromise<MegaStatus[]> {
		// NOTE: do not use Megalodon
		// const data = await this.client.client.getFavourites(opts);
		// if (data.status !== 200) {
		// 	return errorBuilder<MegaStatus[]>(data.statusText);
		// }
		// return { data: data.data };

		return this.direct.getCamelCaseWithLinkPagination<MegaStatus[]>(
			'/api/v1/favourites',
			query,
		);
	}

	async bookmarks(query: BookmarkGetQueryDTO): PaginatedPromise<MegaStatus[]> {
		// Works, but not ideal
		// const data = await this.lib.client.getBookmarks(query);
		// return {
		// 	data: {
		// 		data: data.data,
		// 		minId: null,
		// 		maxId: null,
		// 	},
		// };

		return this.direct.getCamelCaseWithLinkPagination<MastoStatus[]>(
			'/api/v1/bookmarks',
			query,
		);
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

	async getFollowers(
		query: FollowerGetQueryDTO,
	): PaginatedPromise<MastoAccount[]> {
		const { id, ...rest } = query;
		return await this.direct.getCamelCaseWithLinkPagination<MastoAccount[]>(
			`/api/v1/accounts/${id}/followers`,
			rest,
		);
	}

	async getFollowings(
		query: FollowerGetQueryDTO,
	): PaginatedPromise<MastoAccount[]> {
		const { id, ...rest } = query;
		return await this.direct.getCamelCaseWithLinkPagination<MastoAccount[]>(
			`/api/v1/accounts/${id}/following`,
			rest,
		);
	}
}
