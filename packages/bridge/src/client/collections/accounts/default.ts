import {
	AccountMutePostDto,
	AccountRoute,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
} from './_interface.js';
import { FollowPostDto, GetPostsQueryDTO } from '../../types/_interface.js';
import { Endpoints } from 'misskey-js';
import {
	MastoAccount,
	MastoFamiliarFollowers,
	MastoFeaturedTag,
	MastoList,
	MastoRelationship,
	MastoStatus,
} from '#/types/mastojs.types.js';
import {
	MegaAccount,
	MegaRelationship,
	MegaStatus,
} from '#/types/megalodon.types.js';
import { MissUserDetailed } from '#/types/misskey-js.types.js';
import { DriverWebfingerType } from '#/types/query.types.js';
import { PaginatedPromise } from '#/types/api-response.js';

export abstract class BaseAccountsRouter implements AccountRoute {
	async lookup(
		webfinger: DriverWebfingerType,
	): Promise<MastoAccount | MegaAccount> {
		throw new Error('Method not implemented.');
	}

	follow(
		id: string,
		opts: FollowPostDto,
	): Promise<
		MastoRelationship | Endpoints['following/create']['res'] | MegaRelationship
	> {
		throw new Error('Method not implemented.');
	}

	unfollow(
		id: string,
	): Promise<
		MastoRelationship | Endpoints['following/delete']['res'] | MegaRelationship
	> {
		throw new Error('Method not implemented.');
	}

	block(
		id: string,
	): Promise<
		MastoRelationship | Endpoints['blocking/create']['res'] | MegaRelationship
	> {
		throw new Error('Method not implemented.');
	}

	unblock(
		id: string,
	): Promise<
		MastoRelationship | Endpoints['blocking/delete']['res'] | MegaRelationship
	> {
		throw new Error('Method not implemented.');
	}

	mute(id: string, opts: AccountMutePostDto): Promise<MastoRelationship> {
		throw new Error('Method not implemented.');
	}

	unmute(id: string): Promise<MastoRelationship | MegaRelationship> {
		throw new Error('Method not implemented.');
	}

	removeFollower(id: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	featuredTags(id: string): Promise<MastoFeaturedTag[]> {
		throw new Error('Method not implemented.');
	}

	knownFollowers(ids: string[]): Promise<MastoFamiliarFollowers[]> {
		throw new Error('Method not implemented.');
	}

	async getLists(id: string): PaginatedPromise<MastoList[]> {
		throw new Error('Method not implemented.');
	}

	async get(
		id: string,
	): Promise<MastoAccount | MissUserDetailed | MegaAccount> {
		throw new Error('Method not implemented.');
	}

	async resolveMany(
		ids: string[],
	): Promise<MastoAccount[] | MissUserDetailed[]> {
		throw new Error('Method not implemented.');
	}

	async getPosts(
		id: string,
		query: AccountRouteStatusQueryDto,
	): Promise<MastoStatus[]> {
		throw new Error('Method not implemented.');
	}

	async relationships(
		ids: string[],
	): Promise<MastoRelationship[] | MegaRelationship[]> {
		throw new Error('Method not implemented.');
	}

	async likes(
		opts: GetPostsQueryDTO,
	): PaginatedPromise<MastoStatus[] | MegaStatus[]> {
		throw new Error('Method not implemented.');
	}

	async bookmarks(query: BookmarkGetQueryDTO): Promise<{
		data: MastoStatus[] | Endpoints['i/favorites']['res'] | MegaStatus[];
		minId?: string | null;
		maxId?: string | null;
	}> {
		throw new Error('Method not implemented.');
	}

	async getFollowers(query: FollowerGetQueryDTO): Promise<
		| { data: MastoAccount[]; minId?: string | null; maxId?: string | null }
		| {
				data: Endpoints['users/followers']['res'];
				minId?: string | null;
				maxId?: string | null;
		  }
	> {
		throw new Error('Method not implemented.');
	}

	async getFollowings(query: FollowerGetQueryDTO): Promise<
		| { data: MastoAccount[]; minId?: string | null; maxId?: string | null }
		| {
				data: Endpoints['users/followers']['res'];
				minId?: string | null;
				maxId?: string | null;
		  }
	> {
		throw new Error('Method not implemented.');
	}
}

export class DefaultAccountRouter extends BaseAccountsRouter {}
