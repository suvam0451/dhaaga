import {
	AppBskyActorDefs,
	AppBskyFeedDefs,
	AppBskyUnspeccedGetPostThreadV2,
} from '@atproto/api';
import {
	type MastoAccount,
	MastoContext,
	MastoScheduledStatus,
	MastoStatus,
} from '#/types/mastojs.types.js';
import { MissContext, MissNote } from '#/types/misskey-js.types.js';
import { MegaScheduledStatus, MegaStatus } from '#/types/megalodon.types.js';
import {
	DriverBookmarkStateResult,
	DriverLikeStateResult,
} from '#/types/driver.types.js';
import { PaginatedPromise } from '#/types/api-response.js';
import { Endpoints } from 'misskey-js';
import { DhaagaJsPostCreateDto } from '#/client/typings.js';

export interface StatusesRoute {
	getPost(
		id: string,
	): Promise<MastoStatus | MegaStatus | MissNote | AppBskyFeedDefs.PostView>;

	bookmark(id: string): DriverBookmarkStateResult;

	unBookmark(id: string): DriverBookmarkStateResult;

	/**
	 * AT protocol specific implementation
	 * @param uri
	 * @param cid
	 */
	like(uri: string, cid?: string): DriverLikeStateResult;

	removeLike(uri: string, cid?: string): DriverLikeStateResult;

	getPostContext(
		id: string,
		limit?: number,
		sort?: 'newest' | 'oldest' | 'top',
	): Promise<
		MastoContext | MissContext | AppBskyUnspeccedGetPostThreadV2.OutputSchema
	>;

	create(dto: DhaagaJsPostCreateDto): Promise<
		| MastoScheduledStatus
		| MegaStatus
		| MegaScheduledStatus
		| {
				uri: string;
				cid: string;
		  }
	>;

	delete(id: string): Promise<{ success: boolean; deleted: boolean }>;

	getLikedBy(
		id: string,
		limit?: number,
		maxId?: string,
	): PaginatedPromise<AppBskyActorDefs.ProfileView[] | MastoAccount[]>;

	getSharedBy(
		id: string,
		limit?: number,
		maxId?: string,
	): PaginatedPromise<
		| AppBskyActorDefs.ProfileView[]
		| MastoAccount[]
		| Endpoints['notes/renotes']['res']
	>;

	getQuotedBy(
		id: string,
		limit?: number,
		maxId?: string,
	): PaginatedPromise<AppBskyFeedDefs.PostView[] | MastoStatus[] | any>;
}
