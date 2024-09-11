import {
	AccountMutePostDto,
	AccountRoute,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
} from '../_router/routes/accounts.js';
import { LibraryResponse } from '../_router/_types.js';
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
	MegaRelationship,
	MegaStatus,
	MissUserDetailed,
} from '../_interface.js';
import { Endpoints } from 'misskey-js';
import { LibraryPromise } from '../_router/routes/_types.js';

class BlueskyAccountsRouter implements AccountRoute {
	block(
		id: string,
	): Promise<
		LibraryResponse<
			MastoRelationship | Endpoints['blocking/create']['res'] | MegaRelationship
		>
	> {
		return Promise.resolve(undefined) as any;
	}

	bookmarks(query: BookmarkGetQueryDTO): Promise<
		LibraryResponse<{
			data: MastoStatus[] | MegaStatus[] | Endpoints['i/favorites']['res'];
			minId?: string | null;
			maxId?: string | null;
		}>
	> {
		return Promise.resolve(undefined) as any;
	}

	familiarFollowers(ids: string[]): LibraryPromise<MastoFamiliarFollowers[]> {
		return Promise.resolve([]) as any;
	}

	featuredTags(id: string): LibraryPromise<MastoFeaturedTag[]> {
		return Promise.resolve([]) as any;
	}

	follow(
		id: string,
		opts: FollowPostDto,
	): LibraryPromise<
		MastoRelationship | Endpoints['following/create']['res'] | MegaRelationship
	> {
		return Promise.resolve(undefined) as any;
	}

	followers(query: FollowerGetQueryDTO): LibraryPromise<
		| {
				data: MastoAccount[];
				minId?: string | null;
				maxId?: string | null;
		  }
		| {
				data: Endpoints['users/followers']['res'];
				minId?: string | null;
				maxId?: string | null;
		  }
	> {
		return Promise.resolve(undefined) as any;
	}

	followings(query: FollowerGetQueryDTO): LibraryPromise<
		| {
				data: MastoAccount[];
				minId?: string | null;
				maxId?: string | null;
		  }
		| {
				data: Endpoints['users/followers']['res'];
				minId?: string | null;
				maxId?: string | null;
		  }
	> {
		return Promise.resolve(undefined) as any;
	}

	get(
		id: string,
	): LibraryPromise<MastoAccount | MissUserDetailed | MegaAccount> {
		return Promise.resolve(undefined) as any;
	}

	getMany(ids: string[]): LibraryPromise<MastoAccount[] | MissUserDetailed[]> {
		return Promise.resolve(undefined) as any;
	}

	likes(opts: GetPostsQueryDTO): LibraryPromise<MastoStatus[] | MegaStatus[]> {
		return Promise.resolve(undefined) as any;
	}

	lists(id: string): LibraryPromise<MastoList[]> {
		return Promise.resolve([]) as any;
	}

	lookup(webfingerUrl: string): LibraryPromise<MastoAccount | MegaAccount> {
		return Promise.resolve(undefined) as any;
	}

	mute(
		id: string,
		opts: AccountMutePostDto,
	): Promise<LibraryResponse<MastoRelationship | MegaRelationship>> {
		return Promise.resolve(undefined) as any;
	}

	relationships(
		ids: string[],
	): LibraryPromise<MastoRelationship[] | MegaRelationship[]> {
		return Promise.resolve(undefined) as any;
	}

	removeFollower(id: string): Promise<LibraryResponse<void>> {
		return Promise.resolve(undefined) as any;
	}

	statuses(
		id: string,
		params: AccountRouteStatusQueryDto,
	): Promise<LibraryResponse<[] | any[]>> {
		return Promise.resolve(undefined) as any;
	}

	unblock(
		id: string,
	): Promise<
		LibraryResponse<
			MastoRelationship | Endpoints['blocking/delete']['res'] | MegaRelationship
		>
	> {
		return Promise.resolve(undefined) as any;
	}

	unfollow(
		id: string,
	): LibraryPromise<
		MastoRelationship | Endpoints['following/delete']['res'] | MegaRelationship
	> {
		return Promise.resolve(undefined) as any;
	}

	unmute(
		id: string,
	): Promise<LibraryResponse<MastoRelationship | MegaRelationship>> {
		return Promise.resolve(undefined) as any;
	}
}

export default BlueskyAccountsRouter;
