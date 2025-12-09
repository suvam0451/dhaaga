import { Endpoints } from 'misskey-js';
import type {
	AppBskyActorSearchActorsTypeahead,
	AppBskyFeedSearchPosts,
} from '@atproto/api';
import { MastoAccount, MastoStatus } from '#/types/mastojs.types.js';
import { MegaAccount, MegaStatus } from '#/types/megalodon.types.js';
import { PaginatedPromise } from '#/types/api-response.js';

type MastoUnifiedSearchType = {
	q: string;
	following?: boolean;
	type?: 'accounts' | 'hashtags' | 'statuses';
	resolve?: boolean;
	offset?: number;
	minId?: string;
	maxId?: string;
	accountId?: string;
};

type DhaagaJsUserSearchDTO = {
	origin?: 'combined' | 'local' | 'remote';
	allowPartial?: boolean;
	limit: number;
	query: string;
	untilId?: string;
} & MastoUnifiedSearchType;

type DhaagaJsPostSearchDTO = {
	sort?: string;
	allowPartial?: true;
	filetype?: null | 'image' | 'video' | 'audio';
	limit: number;
	order?: 'asc' | 'desc';
	host?: string; // "." for local
	query: string;
	userId?: null;
	sinceId?: string;
	untilId?: string;
} & MastoUnifiedSearchType;

interface SearchRoute {
	findUsers(
		q: DhaagaJsUserSearchDTO,
	): PaginatedPromise<
		| MastoAccount[]
		| Endpoints['users/search']['res']
		| MegaAccount[]
		| AppBskyActorSearchActorsTypeahead.Response
	>;

	findPosts(
		q: DhaagaJsPostSearchDTO,
	): PaginatedPromise<
		| MastoStatus[]
		| Endpoints['notes/search']['res']
		| MegaStatus[]
		| AppBskyFeedSearchPosts.Response
	>;
}

export type {
	MastoUnifiedSearchType,
	DhaagaJsUserSearchDTO,
	DhaagaJsPostSearchDTO,
	SearchRoute,
};
