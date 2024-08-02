import {
	MastoContext,
	MastoScheduledStatus,
	MastoStatus,
	MissContext,
	MissNote,
} from '../../_interface.js';
import { LibraryPromise } from './_types.js';
import { Endpoints } from 'misskey-js';

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
		| 'nonSensitiveOnlyForLocalLikeOnlyForRemote';
	// lang: string;
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
	get(id: string): LibraryPromise<MastoStatus | MissNote>;

	bookmark(
		id: string,
	): LibraryPromise<MastoStatus | Endpoints['notes/favorites/create']['res']>;

	unBookmark(
		id: string,
	): LibraryPromise<MastoStatus | Endpoints['notes/favorites/delete']['res']>;

	getContext(
		id: string,
		limit?: number,
	): LibraryPromise<MastoContext | MissContext>;

	create(dto: DhaagaJsPostCreateDto): LibraryPromise<MastoScheduledStatus>;
}
