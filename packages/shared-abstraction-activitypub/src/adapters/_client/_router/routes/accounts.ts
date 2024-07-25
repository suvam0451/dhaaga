import { LibraryResponse } from '../_types.js';
import { mastodon } from 'masto';
import { Note, UserDetailed } from 'misskey-js/autogen/models.js';
import { Endpoints } from 'misskey-js';
import {
	FollowPostDto,
	MastoAccount,
	MastoFamiliarFollowers,
	MastoFeaturedTag,
	MastoList,
	MastoRelationship,
	MegaAccount,
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
	): Promise<LibraryResponse<MastoRelationship>>;

	unfollow(id: string): Promise<LibraryResponse<MastoRelationship>>;

	/**
	 * Moderation
	 */

	block(id: string): Promise<LibraryResponse<MastoRelationship>>;

	unblock(id: string): Promise<LibraryResponse<MastoRelationship>>;

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

	get(id: string): LibraryPromise<MastoAccount | UserDetailed>;

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
