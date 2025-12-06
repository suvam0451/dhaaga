import {
	AccountRoute,
	AccountMutePostDto,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
} from './_interface.js';
import { FollowPostDto, GetPostsQueryDTO } from '../../types/_interface.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { PaginatedPromise } from '../../../adapters/_client/_router/routes/_types.js';
import {
	MastoAccount,
	MastoFamiliarFollowers,
	MastoFeaturedTag,
	MastoList,
	MastoRelationship,
	MastoStatus,
} from '#/types/mastojs.types.js';
import { MastoJsWrapper } from '#/client/utils/api-wrappers.js';
import { DriverWebfingerType } from '#/types/query.types.js';

export class MastodonAccountsRouter implements AccountRoute {
	direct: FetchWrapper;
	client: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MastoJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async lookup(webfinger: DriverWebfingerType): Promise<MastoAccount> {
		return await this.client.lib.v1.accounts.lookup({
			acct: webfinger.host
				? `${webfinger.username}@${webfinger.host}`
				: webfinger.username,
		});
	}

	async follow(id: string, opts: FollowPostDto): Promise<MastoRelationship> {
		return this.client.lib.v1.accounts.$select(id).follow(opts);
	}

	async unfollow(id: string): Promise<MastoRelationship> {
		return this.client.lib.v1.accounts.$select(id).unfollow();
	}

	async block(id: string): Promise<MastoRelationship> {
		return this.client.lib.v1.accounts.$select(id).block();
	}

	async unblock(id: string): Promise<MastoRelationship> {
		return this.client.lib.v1.accounts.$select(id).unblock();
	}

	async mute(id: string, opts: AccountMutePostDto): Promise<MastoRelationship> {
		return this.client.lib.v1.accounts.$select(id).mute(opts);
	}

	async unmute(id: string): Promise<MastoRelationship> {
		return this.client.lib.v1.accounts.$select(id).unmute();
	}

	async removeFollower(id: string): Promise<void> {
		return this.client.lib.v1.accounts.$select(id).removeFromFollowers();
	}

	async featuredTags(id: string): Promise<MastoFeaturedTag[]> {
		return this.client.lib.v1.accounts.$select(id).featuredTags.list();
	}

	async knownFollowers(ids: string[]): Promise<MastoFamiliarFollowers[]> {
		return this.client.lib.v1.accounts.familiarFollowers.fetch(ids);
	}

	async getLists(id: string): PaginatedPromise<MastoList[]> {
		const data = await this.client.lib.v1.lists.list();
		// TODO: extract cursor from lists
		return { data };
	}

	async statuses(
		id: string,
		query: AccountRouteStatusQueryDto,
	): Promise<MastoStatus[]> {
		try {
			return await this.client.lib.v1.accounts.$select(id).statuses.list(query);
		} catch (e: any) {
			throw new Error(e);
		}
	}

	async get(id: string): Promise<MastoAccount> {
		return this.client.lib.v1.accounts.$select(id).fetch();
	}

	async resolveMany(ids: string[]): Promise<MastoAccount[]> {
		// FIXME: does this work?
		return (await new FetchWrapper(
			this.direct.baseUrl,
			this.direct.token,
		).getCamelCase('/api/v1/accounts', { id: ids })) as any;
	}

	async relationships(ids: string[]): Promise<MastoRelationship[]> {
		return await this.client.lib.v1.accounts.relationships.fetch({
			id: ids,
			withSuspended: true,
		});
	}

	async likes(query: GetPostsQueryDTO): PaginatedPromise<MastoStatus[]> {
		return this.direct.getCamelCaseWithLinkPagination<MastoStatus[]>(
			'/api/v1/favourites',
			query,
		);
	}

	async bookmarks(query: BookmarkGetQueryDTO): PaginatedPromise<MastoStatus[]> {
		return this.direct.getCamelCaseWithLinkPagination<MastoStatus[]>(
			'/api/v1/bookmarks',
			query,
		);
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
