import type {
	AppBskyActorDefs,
	AppBskyActorGetProfile,
	AppBskyBookmarkDefs,
	AppBskyFeedDefs,
	AppBskyFeedGetActorLikes,
	AppBskyGraphDefs,
	ComAtprotoIdentityResolveHandle,
} from '@atproto/api';
import { Endpoints } from 'misskey-js';
import type {
	MastoAccount,
	MastoFamiliarFollowers,
	MastoFeaturedTag,
	MastoRelationship,
} from '#/types/mastojs.types.js';
import { AccountRoute } from './_interface.js';
import {
	AccountMutePostDto,
	AccountRouteStatusQueryDto,
	BookmarkGetQueryDTO,
	FollowerGetQueryDTO,
	FollowPostDto,
	GetPostsQueryDTO,
} from '../../typings.js';
import { MegaRelationship } from '#/types/megalodon.types.js';
import { MissUserDetailed } from '#/types/misskey-js.types.js';
import { AppAtpSessionData } from '#/types/atproto.js';
import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs.js';
import { DriverWebfingerType } from '#/types/query.types.js';
import { getBskyAgent, getXrpcAgent } from '#/utils/atproto.js';
import { errorBuilder } from '#/types/index.js';
import { ApiErrorCode, PaginatedPromise } from '#/types/api-response.js';

class BlueskyAccountsRouter implements AccountRoute {
	dto: AppAtpSessionData;

	constructor(dto: AppAtpSessionData) {
		this.dto = dto;
	}

	block(
		id: string,
	): Promise<
		Promise<
			MastoRelationship | Endpoints['blocking/create']['res'] | MegaRelationship
		>
	> {
		return Promise.resolve(undefined) as any;
	}

	async bookmarks(
		query: BookmarkGetQueryDTO,
	): PaginatedPromise<AppBskyBookmarkDefs.BookmarkView[]> {
		const agent = getXrpcAgent(this.dto);
		const { data } = await agent.app.bsky.bookmark.getBookmarks({
			limit: query.limit,
			cursor: query.maxId,
		});
		return {
			data: data.bookmarks,
			maxId: data.cursor,
		};
	}

	async knownFollowers(ids: string[]): Promise<MastoFamiliarFollowers[]> {
		throw new Error(
			'Method not implemented. Please use accounts.get method,' +
				' which includes the knownFollowers object ',
		);
	}

	async featuredTags(id: string): Promise<MastoFeaturedTag[]> {
		throw new Error('Method not available for driver');
	}

	async follow(
		id: string,
		opts: FollowPostDto,
	): Promise<{ uri: string; cid: string }> {
		const agent = getXrpcAgent(this.dto);
		return await agent.follow(id);
	}

	async getFollowers(
		query: FollowerGetQueryDTO,
	): PaginatedPromise<AppBskyActorDefs.ProfileView[]> {
		const agent = getBskyAgent(this.dto);
		const data = await agent.getFollowers({ actor: query.id });
		return {
			data: data.data.followers,
			maxId: data.data.cursor,
		};
	}

	async getFollowings(
		query: FollowerGetQueryDTO,
	): PaginatedPromise<AppBskyActorDefs.ProfileView[]> {
		const agent = getBskyAgent(this.dto);
		const data = await agent.getFollows({ actor: query.id });
		return {
			data: data.data.follows,
			maxId: data.data.cursor,
		};
	}

	/**
	 * NOTE: remember that this also gives us known followers
	 * @param did
	 */
	async get(did: string): Promise<AppBskyActorGetProfile.Response> {
		const agent = getBskyAgent(this.dto);
		return agent.getProfile({ actor: did });
	}

	/**
	 * Exchange handle for a did
	 */
	async getDid(
		handle: string,
	): Promise<ComAtprotoIdentityResolveHandle.Response> {
		const agent = getBskyAgent(this.dto);
		return agent.resolveHandle({ handle });
	}

	async resolveMany(
		ids: string[],
	): Promise<MastoAccount[] | MissUserDetailed[]> {
		throw new Error('Method not implemented.');
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
	): Promise<AppBskyFeedGetActorLikes.OutputSchema> {
		const agent = getBskyAgent(this.dto);
		const data = await agent.getActorLikes({ actor, cursor, limit });
		return data.data;
	}

	async getLists(id: string): PaginatedPromise<AppBskyGraphDefs.ListView[]> {
		const agent = getXrpcAgent(this.dto);
		const lists = await agent.app.bsky.graph.getLists({ actor: id });
		return {
			data: lists.data.lists,
			maxId: lists.data.cursor,
		};
	}

	lookup(webfinger: DriverWebfingerType): Promise<MastoAccount> {
		throw new Error('Method not implemented.');
	}

	mute(
		id: string,
		opts: AccountMutePostDto,
	): Promise<MastoRelationship | MegaRelationship> {
		throw new Error('Method not implemented.');
	}

	async relationships(
		ids: string[],
	): Promise<MastoRelationship[] | MegaRelationship[]> {
		throw new Error('Method not implemented.');
	}

	async removeFollower(id: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async getPosts(
		id: string,
		params: AccountRouteStatusQueryDto,
	): PaginatedPromise<AppBskyFeedDefs.FeedViewPost[]> {
		const agent = getBskyAgent(this.dto);
		const data = await agent.getAuthorFeed({
			actor: id,
			filter: params.bskyFilter,
			limit: params.limit,
			cursor: params.maxId === null ? undefined : params.maxId,
		});
		return { data: data.data.feed, maxId: data.data.cursor };
	}

	unblock(id: string): Promise<Promise<MastoRelationship>> {
		return Promise.resolve(undefined) as any;
	}

	async unfollow(id: string): Promise<MastoRelationship | null> {
		const agent = getXrpcAgent(this.dto);
		await agent.deleteFollow(id);
		return null;
	}

	unmute(id: string): Promise<Promise<MastoRelationship | MegaRelationship>> {
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
