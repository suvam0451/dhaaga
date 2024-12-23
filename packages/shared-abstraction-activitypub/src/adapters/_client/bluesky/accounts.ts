import {
	AccountMutePostDto,
	AccountRoute,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
} from '../_router/routes/accounts.js';
import { FollowPostDto, GetPostsQueryDTO } from '../_interface.js';
import { Endpoints } from 'misskey-js';
import { LibraryPromise } from '../_router/routes/_types.js';
import {
	AppBskyActorGetProfile,
	AppBskyFeedGetAuthorFeed,
	AppBskyGraphGetFollowers,
	AppBskyGraphGetFollows,
	AtpSessionData,
	ComAtprotoIdentityResolveHandle,
} from '@atproto/api';
import { getBskyAgent } from '../_router/_api.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
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
import {
	DhaagaErrorCode,
	LibraryResponse,
} from '../../../types/result.types.js';

class BlueskyAccountsRouter implements AccountRoute {
	dto: AtpSessionData;
	constructor(dto: AtpSessionData) {
		this.dto = dto;
	}

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

	async followers(
		query: FollowerGetQueryDTO,
	): LibraryPromise<AppBskyGraphGetFollowers.Response> {
		const agent = getBskyAgent(this.dto);
		try {
			const data = await agent.getFollowers({ actor: query.id });
			return { data };
		} catch (e) {
			return errorBuilder(e);
		}
	}

	async followings(
		query: FollowerGetQueryDTO,
	): LibraryPromise<AppBskyGraphGetFollows.Response> {
		const agent = getBskyAgent(this.dto);
		try {
			const data = await agent.getFollows({ actor: query.id });
			return { data };
		} catch (e) {
			return errorBuilder(e);
		}
	}

	async get(did: string): LibraryPromise<AppBskyActorGetProfile.Response> {
		const agent = getBskyAgent(this.dto);
		try {
			const data = await agent.getProfile({ actor: did });
			return { data };
		} catch (e) {
			return errorBuilder(e);
		}
	}

	/**
	 * Exchange handle for a did
	 */
	async getDid(
		handle: string,
	): LibraryPromise<ComAtprotoIdentityResolveHandle.Response> {
		const agent = getBskyAgent(this.dto);
		try {
			const data = await agent.resolveHandle({ handle });
			return { data };
		} catch (e) {
			console.log('[WARN]: failed to resolve handle', e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
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

	async statuses(
		id: string,
		params: AccountRouteStatusQueryDto,
	): LibraryPromise<AppBskyFeedGetAuthorFeed.Response> {
		const agent = getBskyAgent(this.dto);
		try {
			const data = await agent.getAuthorFeed({
				actor: id,
				filter: params.bskyFilter,
				limit: params.limit,
			});
			return { data };
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
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
