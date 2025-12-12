import { AccountRoute } from './_interface.js';
import {
	AccountMutePostDto,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
	GetPostsQueryDTO,
} from '../../typings.js';
import FetchWrapper from '#/client/utils/fetch.js';
import type {
	MastoAccount,
	MastoFamiliarFollowers,
	MastoFeaturedTag,
	MastoList,
	MastoRelationship,
	MastoStatus,
} from '#/types/mastojs.types.js';
import type {
	MegaAccount,
	MegaRelationship,
	MegaStatus,
} from '#/types/megalodon.types.js';
import { MegalodonPleromaWrapper } from '#/client/utils/api-wrappers.js';
import { CasingUtil } from '#/utils/casing.js';
import { DriverWebfingerType } from '#/types/query.types.js';
import { errorBuilder, MissUserDetailed } from '#/types/index.js';
import { PaginatedPromise } from '#/types/api-response.js';

export class PleromaAccountsRouter implements AccountRoute {
	direct: FetchWrapper;
	client: MegalodonPleromaWrapper;

	constructor(forwarded: FetchWrapper) {
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

	async getPosts(id: string, query: AccountRouteStatusQueryDto): Promise<any> {
		const data = await this.client.client.getAccountStatuses(
			id,
			CasingUtil.snakeCaseKeys(query) as any,
		);
		return {
			data: CasingUtil.camelCaseKeys(data.data),
			maxId: null,
			minId: null,
		};
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

	async follow(id: string): Promise<MegaRelationship> {
		// Akkoma 400s on /follow with body
		const data = await this.client.client.followAccount(id);
		if (data.status !== 200) {
			return errorBuilder(data.statusText);
		}
		// console.log(data, error);
		return { data: CasingUtil.camelCaseKeys(data.data) };
	}

	async unfollow(id: string): Promise<MegaRelationship> {
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

	block(id: string): Promise<MegaRelationship> {
		throw new Error('Method not implemented.');
	}

	featuredTags(id: string): Promise<MastoFeaturedTag[]> {
		throw new Error('Method not implemented.');
	}

	getLists(id: string): PaginatedPromise<MastoList[]> {
		throw new Error('Method not implemented.');
	}

	knownFollowers(ids: string[]): Promise<MastoFamiliarFollowers[]> {
		throw new Error('Method not implemented.');
	}

	mute(
		id: string,
		opts: AccountMutePostDto,
	): Promise<MastoRelationship | MegaRelationship> {
		throw new Error('Method not implemented.');
	}

	removeFollower(id: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	resolveMany(ids: string[]): Promise<MastoAccount[] | MissUserDetailed[]> {
		throw new Error('Method not implemented.');
	}

	unblock(id: string): Promise<MegaRelationship> {
		throw new Error('Method not implemented.');
	}

	unmute(id: string): Promise<MastoRelationship | MegaRelationship> {
		throw new Error('Method not implemented.');
	}
}
