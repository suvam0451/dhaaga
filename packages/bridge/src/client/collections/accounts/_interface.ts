import { Endpoints } from 'misskey-js';
import { FollowPostDto, GetPostsQueryDTO } from '../../types/_interface.js';
import type {
	AppBskyActorDefs,
	AppBskyActorGetProfile,
	AppBskyBookmarkDefs,
	AppBskyFeedGetAuthorFeed,
	AppBskyGraphDefs,
} from '@atproto/api';
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
import type { MissUserDetailed } from '#/types/misskey-js.types.js';
import { DriverWebfingerType } from '#/types/query.types.js';

import { PaginatedPromise } from '#/types/api-response.js';

export type BookmarkGetQueryDTO = {
	limit: number;
	maxId?: string;
	minId?: string;
};

export type FollowerGetQueryDTO = {
	allowPartial: boolean;
	limit: number;
	id: string;
	maxId: string | null;
};

type DefaultPaginationParams = {
	// masto.js
	readonly maxId?: string | null;
	readonly sinceId?: string | null;
	readonly minId?: string | null;
	readonly limit?: number | null;
};

type ListAccountStatusesParams = DefaultPaginationParams & {
	// masto.js
	readonly onlyMedia?: boolean | null;
	readonly pinned?: boolean | null;
	readonly excludeReplies?: boolean | null;
	readonly excludeReblogs?: boolean | null;
	readonly tagged?: string | null;
};

export type AccountRouteStatusQueryDto = ListAccountStatusesParams &
	Endpoints['users/notes']['req'] & {
		bskyFilter?: 'posts_with_media';
	};

export type AccountMutePostDto = {
	notifications: boolean;
	duration: number;
};

export interface AccountRoute {
	/**
	 * Relations
	 */

	follow(
		id: string,
		opts: FollowPostDto,
	): Promise<
		| MastoRelationship
		| Endpoints['following/create']['res']
		| MegaRelationship
		| { uri: string; cid: string }
	>;

	unfollow(
		id: string,
	): Promise<
		MastoRelationship | Endpoints['following/delete']['res'] | MegaRelationship
	>;

	/**
	 * Moderation
	 */

	block(
		id: string,
	): Promise<
		MastoRelationship | Endpoints['blocking/create']['res'] | MegaRelationship
	>;

	unblock(
		id: string,
	): Promise<
		MastoRelationship | Endpoints['blocking/delete']['res'] | MegaRelationship
	>;

	mute(
		id: string,
		opts: AccountMutePostDto,
	): Promise<MastoRelationship | MegaRelationship>;

	unmute(id: string): Promise<MastoRelationship | MegaRelationship>;

	removeFollower(id: string): Promise<void>;

	// 200/400
	// mastodon/misskey/akkoma/pleroma
	lookup(
		webfingerUrl: DriverWebfingerType,
	): Promise<MastoAccount | MegaAccount>;

	/**
	 * General
	 */

	/**
	 * NOTE: masto.js returns the account first,
	 * then the status array.
	 *
	 * be careful.
	 * @param id
	 * @param params
	 */
	statuses(
		id: string,
		params: AccountRouteStatusQueryDto,
	): Promise<
		| MastoStatus[]
		| Endpoints['users/notes']['res']
		| AppBskyFeedGetAuthorFeed.Response
		| any[]
	>;

	get(
		id: string,
	): Promise<
		| MastoAccount
		| MissUserDetailed
		| MegaAccount
		| AppBskyActorGetProfile.Response
	>;

	resolveMany(ids: string[]): Promise<MastoAccount[] | MissUserDetailed[]>;

	relationships(
		ids: string[],
	): Promise<MastoRelationship[] | MegaRelationship[]>;

	featuredTags(id: string): Promise<MastoFeaturedTag[]>;

	knownFollowers(ids: string[]): Promise<MastoFamiliarFollowers[]>;

	/**
	 * Lists this user is part of
	 * @param id
	 */
	getLists(
		id: string,
	): PaginatedPromise<
		| MastoList[]
		| AppBskyGraphDefs.ListView[]
		| Endpoints['users/lists/list']['res']
	>;

	likes(opts: GetPostsQueryDTO): PaginatedPromise<MastoStatus[] | MegaStatus[]>;

	bookmarks(
		query: BookmarkGetQueryDTO,
	): PaginatedPromise<
		| MastoStatus[]
		| MegaStatus[]
		| Endpoints['i/favorites']['res']
		| AppBskyBookmarkDefs.BookmarkView[]
	>;

	getFollowers(
		query: FollowerGetQueryDTO,
	): PaginatedPromise<
		| MastoAccount[]
		| Endpoints['users/followers']['res']
		| AppBskyActorDefs.ProfileView[]
	>;

	getFollowings(
		query: FollowerGetQueryDTO,
	): PaginatedPromise<
		| MastoAccount[]
		| Endpoints['users/followers']['res']
		| AppBskyActorDefs.ProfileView[]
	>;
}
