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
	AppBskyFeedGetActorLikes,
	AppBskyFeedGetAuthorFeed,
	AppBskyGraphGetFollowers,
	AppBskyGraphGetFollows,
	ComAtprotoIdentityResolveHandle,
} from '@atproto/api';
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
import { ApiErrorCode, LibraryResponse } from '../../../types/result.types.js';
import { InvokeBskyFunction } from '../../../custom-clients/custom-bsky-agent.js';
import { AppAtpSessionData } from '../../../types/atproto.js';
import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs.js';
import { ApiAsyncResult } from '../../../utils/api-result.js';
import { Err, Ok } from '../../../utils/index.js';
import { DriverWebfingerType } from '../../../types/query.types.js';
import { getBskyAgent, getXrpcAgent } from '../../../utils/atproto.js';

class BlueskyAccountsRouter implements AccountRoute {
	dto: AppAtpSessionData;

	constructor(dto: AppAtpSessionData) {
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

	async follow(
		id: string,
		opts: FollowPostDto,
	): LibraryPromise<
		MastoRelationship | Endpoints['following/create']['res'] | MegaRelationship
	> {
		try {
			const agent = getXrpcAgent(this.dto);
			const followResult = await agent.follow(id);
			return { data: null as any };
		} catch (e) {
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		}
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
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	getMany(ids: string[]): LibraryPromise<MastoAccount[] | MissUserDetailed[]> {
		return Promise.resolve(undefined) as any;
	}

	likes(query: GetPostsQueryDTO) {
		return errorBuilder<any>(ApiErrorCode.FEATURE_UNSUPPORTED) as any;
	}

	async atProtoLikes(
		actor: string,
		{
			limit,
			cursor,
		}: {
			limit: number;
			cursor: string | undefined;
		},
	): LibraryPromise<AppBskyFeedGetActorLikes.OutputSchema> {
		const agent = getBskyAgent(this.dto);
		return InvokeBskyFunction<AppBskyFeedGetActorLikes.OutputSchema>(
			'getActorLikes',
			agent.getActorLikes,
			agent.app.bsky.feed,
			{
				actor,
				cursor,
				limit,
			},
		);
	}

	lists(id: string): LibraryPromise<MastoList[]> {
		return Promise.resolve([]) as any;
	}

	lookup(webfinger: DriverWebfingerType): ApiAsyncResult<MastoAccount> {
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
	): ApiAsyncResult<AppBskyFeedGetAuthorFeed.Response> {
		const agent = getBskyAgent(this.dto);
		try {
			const data = await agent.getAuthorFeed({
				actor: id,
				filter: params.bskyFilter,
				limit: params.limit,
			});
			return Ok(data);
		} catch (e) {
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	unblock(id: string): Promise<LibraryResponse<MastoRelationship>> {
		return Promise.resolve(undefined) as any;
	}

	async unfollow(id: string): LibraryPromise<MastoRelationship> {
		try {
			const agent = getXrpcAgent(this.dto);
			await agent.deleteFollow(id);
			return { data: null as any };
		} catch (e) {
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	unmute(
		id: string,
	): Promise<LibraryResponse<MastoRelationship | MegaRelationship>> {
		return Promise.resolve(undefined) as any;
	}

	/**
	 * Fetch at max 10 posts pinned by this user
	 * @param did
	 */
	async getPinnedPosts(did: string): Promise<FeedViewPost[]> {
		const agent = getXrpcAgent(this.dto);
		try {
			const data = await agent.getAuthorFeed({
				includePins: true,
				actor: did,
				limit: 10,
			});
			return data.data.feed.filter(
				(o) => o.reason && o.reason.$type === 'app.bsky.feed.defs#reasonPin',
			);
		} catch (e) {
			return [];
		}
	}
}

export default BlueskyAccountsRouter;
