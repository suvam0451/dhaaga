import {
	AccountMutePostDto,
	AccountRoute,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
} from '../_router/routes/accounts.js';
import { DhaagaErrorCode, LibraryResponse } from '../_router/_types.js';
import {
	FollowPostDto,
	GetPostsQueryDTO,
	MastoAccount,
	MastoFamiliarFollowers,
	MastoFeaturedTag,
	MastoList,
	MastoRelationship,
	MastoStatus,
	MegaAccount,
	MegaStatus,
	MissUserDetailed,
} from '../_interface.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { UserDetailed } from 'misskey-js/autogen/models.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { Endpoints } from 'misskey-js';

export abstract class BaseAccountsRouter implements AccountRoute {
	async lookup(
		webfingerUrl: string,
	): LibraryPromise<MastoAccount | MegaAccount> {
		throw new Error('Method not implemented.');
	}

	follow(
		id: string,
		opts: FollowPostDto,
	): LibraryPromise<MastoRelationship | Endpoints['following/create']['res']> {
		throw new Error('Method not implemented.');
	}

	unfollow(
		id: string,
	): LibraryPromise<MastoRelationship | Endpoints['following/delete']['res']> {
		throw new Error('Method not implemented.');
	}

	block(
		id: string,
	): LibraryPromise<MastoRelationship | Endpoints['blocking/create']['res']> {
		throw new Error('Method not implemented.');
	}

	unblock(
		id: string,
	): LibraryPromise<MastoRelationship | Endpoints['blocking/delete']['res']> {
		throw new Error('Method not implemented.');
	}

	mute(
		id: string,
		opts: AccountMutePostDto,
	): Promise<LibraryResponse<MastoRelationship>> {
		throw new Error('Method not implemented.');
	}

	unmute(id: string): Promise<LibraryResponse<MastoRelationship>> {
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
	): Promise<LibraryResponse<MastoAccount | MissUserDetailed>> {
		return {
			error: {
				code: DhaagaErrorCode.FEATURE_UNSUPPORTED,
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
	): Promise<LibraryResponse<MastoStatus[]>> {
		return notImplementedErrorBuilder<MastoStatus[]>();
	}

	async relationships(
		ids: string[],
	): Promise<LibraryResponse<MastoRelationship[]>> {
		return notImplementedErrorBuilder();
	}

	async likes(
		opts: GetPostsQueryDTO,
	): LibraryPromise<MastoStatus[] | MegaStatus[]> {
		return notImplementedErrorBuilder();
	}

	async bookmarks(query: BookmarkGetQueryDTO): LibraryPromise<{
		data: MastoStatus[] | Endpoints['i/favorites']['res'] | MegaStatus[];
		minId?: string | null;
		maxId?: string | null;
	}> {
		return notImplementedErrorBuilder();
	}
}

export class DefaultAccountRouter extends BaseAccountsRouter {}
