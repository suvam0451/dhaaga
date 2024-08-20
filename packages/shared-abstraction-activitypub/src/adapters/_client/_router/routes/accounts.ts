import { LibraryResponse } from '../_types.js';
import { mastodon } from 'masto';
import { Note } from 'misskey-js/autogen/models.js';
import { Endpoints } from 'misskey-js';
import {
	FollowPostDto,
	MastoAccount,
	MastoFamiliarFollowers,
	MastoFeaturedTag,
	MastoList,
	MastoRelationship,
	MegaAccount,
	MissUserDetailed,
} from '../../_interface.js';
import { LibraryPromise } from './_types.js';

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
	): LibraryPromise<MastoRelationship | Endpoints['following/create']['res']>;

	unfollow(
		id: string,
	): LibraryPromise<MastoRelationship | Endpoints['following/delete']['res']>;

	/**
	 * Moderation
	 */

	block(
		id: string,
	): Promise<
		LibraryResponse<MastoRelationship | Endpoints['blocking/create']['res']>
	>;

	unblock(
		id: string,
	): Promise<
		LibraryResponse<MastoRelationship | Endpoints['blocking/delete']['res']>
	>;

	mute(
		id: string,
		opts: AccountMutePostDto,
	): Promise<LibraryResponse<MastoRelationship>>;

	unmute(id: string): Promise<LibraryResponse<MastoRelationship>>;

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

	get(id: string): LibraryPromise<MastoAccount | MissUserDetailed>;

	getMany(ids: string[]): LibraryPromise<MastoAccount[] | MissUserDetailed[]>;

	relationships(ids: string[]): Promise<LibraryResponse<MastoRelationship[]>>;

	featuredTags(id: string): Promise<LibraryResponse<MastoFeaturedTag[]>>;

	familiarFollowers(
		ids: string[],
	): Promise<LibraryResponse<MastoFamiliarFollowers[]>>;

	/**
	 * Lists this user is part of
	 * @param id
	 */
	lists(id: string): Promise<LibraryResponse<MastoList[]>>;
}
