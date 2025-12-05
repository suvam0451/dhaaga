import {
	AccountMutePostDto,
	AccountRoute,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
} from '../_router/routes/accounts.js';
import { FollowPostDto, GetPostsQueryDTO } from '../_interface.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { UserDetailed } from 'misskey-js/autogen/models.js';
import {
	LibraryPromise,
	PaginatedLibraryPromise,
} from '../_router/routes/_types.js';
import { Endpoints } from 'misskey-js';
import {
	MastoAccount,
	MastoFamiliarFollowers,
	MastoFeaturedTag,
	MastoList,
	MastoRelationship,
	MastoStatus,
} from '../../../types/mastojs.types.js';
import {
	MegaAccount,
	MegaRelationship,
	MegaStatus,
} from '../../../types/megalodon.types.js';
import { MissUserDetailed } from '../../../types/misskey-js.types.js';
import { ApiErrorCode, LibraryResponse } from '../../../types/result.types.js';
import { ApiAsyncResult } from '../../../utils/api-result.js';
import { Err } from '../../../utils/index.js';
import { DriverWebfingerType } from '../../../types/query.types.js';

export abstract class BaseAccountsRouter implements AccountRoute {
	async lookup(
		webfinger: DriverWebfingerType,
	): ApiAsyncResult<MastoAccount | MegaAccount> {
		throw new Error('Method not implemented.');
	}

	follow(
		id: string,
		opts: FollowPostDto,
	): LibraryPromise<
		MastoRelationship | Endpoints['following/create']['res'] | MegaRelationship
	> {
		throw new Error('Method not implemented.');
	}

	unfollow(
		id: string,
	): LibraryPromise<
		MastoRelationship | Endpoints['following/delete']['res'] | MegaRelationship
	> {
		throw new Error('Method not implemented.');
	}

	block(
		id: string,
	): LibraryPromise<
		MastoRelationship | Endpoints['blocking/create']['res'] | MegaRelationship
	> {
		throw new Error('Method not implemented.');
	}

	unblock(
		id: string,
	): LibraryPromise<
		MastoRelationship | Endpoints['blocking/delete']['res'] | MegaRelationship
	> {
		throw new Error('Method not implemented.');
	}

	mute(
		id: string,
		opts: AccountMutePostDto,
	): Promise<LibraryResponse<MastoRelationship>> {
		throw new Error('Method not implemented.');
	}

	unmute(
		id: string,
	): Promise<LibraryResponse<MastoRelationship | MegaRelationship>> {
		throw new Error('Method not implemented.');
	}

	removeFollower(id: string): Promise<LibraryResponse<void>> {
		throw new Error('Method not implemented.');
	}

	featuredTags(id: string): Promise<LibraryResponse<MastoFeaturedTag[]>> {
		throw new Error('Method not implemented.');
	}

	familiarFollowers(
		ids: string[],
	): Promise<LibraryResponse<MastoFamiliarFollowers[]>> {
		throw new Error('Method not implemented.');
	}

	lists(id: string): Promise<LibraryResponse<MastoList[]>> {
		throw new Error('Method not implemented.');
	}

	async get(
		id: string,
	): Promise<LibraryResponse<MastoAccount | MissUserDetailed | MegaAccount>> {
		return {
			error: {
				code: ApiErrorCode.FEATURE_UNSUPPORTED,
			},
		} as LibraryResponse<MastoAccount | UserDetailed>;
	}

	async getMany(
		ids: string[],
	): LibraryPromise<MastoAccount[] | MissUserDetailed[]> {
		return notImplementedErrorBuilder<MastoAccount[]>();
	}

	async statuses(
		id: string,
		query: AccountRouteStatusQueryDto,
	): Promise<MastoStatus[]> {
		throw new Error(ApiErrorCode.INCOMPATIBLE_DRIVER);
	}

	async relationships(
		ids: string[],
	): Promise<LibraryResponse<MastoRelationship[] | MegaRelationship[]>> {
		return notImplementedErrorBuilder();
	}

	async likes(
		opts: GetPostsQueryDTO,
	): PaginatedLibraryPromise<MastoStatus[] | MegaStatus[]> {
		return notImplementedErrorBuilder();
	}

	async bookmarks(query: BookmarkGetQueryDTO): LibraryPromise<{
		data: MastoStatus[] | Endpoints['i/favorites']['res'] | MegaStatus[];
		minId?: string | null;
		maxId?: string | null;
	}> {
		return notImplementedErrorBuilder();
	}

	async followers(query: FollowerGetQueryDTO): LibraryPromise<
		| { data: MastoAccount[]; minId?: string | null; maxId?: string | null }
		| {
				data: Endpoints['users/followers']['res'];
				minId?: string | null;
				maxId?: string | null;
		  }
	> {
		throw new Error('Method not implemented.');
	}

	async followings(query: FollowerGetQueryDTO): LibraryPromise<
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
