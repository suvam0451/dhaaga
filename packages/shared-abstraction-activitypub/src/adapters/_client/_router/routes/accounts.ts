import { LibraryResponse } from '../_types.js';
import { mastodon } from 'masto';
import { Note } from 'misskey-js/autogen/models.js';
import { Endpoints } from 'misskey-js';
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
} from '../../_interface.js';
import { LibraryPromise } from './_types.js';
import { AppBskyActorGetProfile } from '@atproto/api';

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
	Endpoints['users/notes']['req'];

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
	): LibraryPromise<
		MastoRelationship | Endpoints['following/create']['res'] | MegaRelationship
	>;

	unfollow(
		id: string,
	): LibraryPromise<
		MastoRelationship | Endpoints['following/delete']['res'] | MegaRelationship
	>;

	/**
	 * Moderation
	 */

	block(
		id: string,
	): Promise<
		LibraryResponse<
			MastoRelationship | Endpoints['blocking/create']['res'] | MegaRelationship
		>
	>;

	unblock(
		id: string,
	): Promise<
		LibraryResponse<
			MastoRelationship | Endpoints['blocking/delete']['res'] | MegaRelationship
		>
	>;

	mute(
		id: string,
		opts: AccountMutePostDto,
	): Promise<LibraryResponse<MastoRelationship | MegaRelationship>>;

	unmute(
		id: string,
	): Promise<LibraryResponse<MastoRelationship | MegaRelationship>>;

	removeFollower(id: string): Promise<LibraryResponse<void>>;

	// 200/400
	// mastodon/misskey/akkoma/pleroma
	lookup(webfingerUrl: string): LibraryPromise<MastoAccount | MegaAccount>;

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
	): Promise<LibraryResponse<mastodon.v1.Status[] | Note[] | any[]>>;

	get(
		id: string,
	): LibraryPromise<
		| MastoAccount
		| MissUserDetailed
		| MegaAccount
		| AppBskyActorGetProfile.Response
	>;

	getMany(ids: string[]): LibraryPromise<MastoAccount[] | MissUserDetailed[]>;

	relationships(
		ids: string[],
	): LibraryPromise<MastoRelationship[] | MegaRelationship[]>;

	featuredTags(id: string): LibraryPromise<MastoFeaturedTag[]>;

	familiarFollowers(ids: string[]): LibraryPromise<MastoFamiliarFollowers[]>;

	/**
	 * Lists this user is part of
	 * @param id
	 */
	lists(id: string): LibraryPromise<MastoList[]>;

	likes(opts: GetPostsQueryDTO): LibraryPromise<MastoStatus[] | MegaStatus[]>;

	bookmarks(query: BookmarkGetQueryDTO): Promise<
		LibraryResponse<{
			data: MastoStatus[] | MegaStatus[] | Endpoints['i/favorites']['res'];
			minId?: string | null;
			maxId?: string | null;
		}>
	>;

	followers(query: FollowerGetQueryDTO): LibraryPromise<
		| { data: MastoAccount[]; minId?: string | null; maxId?: string | null }
		| {
				data: Endpoints['users/followers']['res'];
				minId?: string | null;
				maxId?: string | null;
		  }
	>;

	followings(query: FollowerGetQueryDTO): LibraryPromise<
		| { data: MastoAccount[]; minId?: string | null; maxId?: string | null }
		| {
				data: Endpoints['users/followers']['res'];
				minId?: string | null;
				maxId?: string | null;
		  }
	>;
}
