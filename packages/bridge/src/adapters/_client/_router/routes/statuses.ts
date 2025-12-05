import { LibraryPromise } from './_types.js';
import { AppBskyFeedGetPostThread } from '@atproto/api';
import {
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

export type DhaagaJsPostCreateDto = {
	inReplyToId: null | string;
	language: string;
	mediaIds: string[];
	poll?: any;
	sensitive: boolean;
	spoilerText?: string;
	status: string;
	mastoVisibility?: 'direct' | 'public' | 'unlisted' | 'private';

	// misskey
	misskeyVisibility?: 'public' | 'home' | 'followers' | 'specified';
	visibleUserIds?: string[];

	// cw?: string | null
	localOnly: boolean;
	reactionAcceptance?:
		| null
		| 'likeOnly'
		| 'likeOnlyForRemote'
		| 'nonSensitiveOnly'
		| 'nonSensitiveOnlyForLocalLikeOnlyForRemote'; // lang: string;
	// replyId?: string | null;
	// renoteId?: string | null;
	// channelId?: string | null;
	// text?: string | null;

	// what do these evn do ???
	// noExtractMentions?: boolean;
	// noExtractHashtags?: boolean;
	// noExtractEmojis?: boolean;
};

export interface StatusesRoute {
	get(
		id: string,
	): LibraryPromise<
		MastoStatus | MegaStatus | MissNote | AppBskyFeedGetPostThread.Response
	>;

	bookmark(id: string): DriverBookmarkStateResult;

	unBookmark(id: string): DriverBookmarkStateResult;

	/**
	 * AT protocol specific implementation
	 * @param uri
	 * @param cid
	 */
	like(uri: string, cid?: string): DriverLikeStateResult;

	removeLike(uri: string, cid?: string): DriverLikeStateResult;

	getContext(
		id: string,
		limit?: number,
	): LibraryPromise<
		MastoContext | MissContext | AppBskyFeedGetPostThread.Response
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
}
