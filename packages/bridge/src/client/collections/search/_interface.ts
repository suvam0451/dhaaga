import { Endpoints } from 'misskey-js';
import type { AppBskyActorDefs, AppBskyFeedSearchPosts } from '@atproto/api';
import { MastoAccount, MastoStatus } from '#/types/mastojs.types.js';
import { MegaAccount, MegaStatus } from '#/types/megalodon.types.js';
import { PaginatedPromise } from '#/types/api-response.js';
import {
	DhaagaJsPostSearchDTO,
	DhaagaJsUserSearchDTO,
} from '#/client/typings.js';

interface SearchRoute {
	findUsers(
		q: DhaagaJsUserSearchDTO,
	): PaginatedPromise<
		| MastoAccount[]
		| Endpoints['users/search']['res']
		| MegaAccount[]
		| AppBskyActorDefs.ProfileViewBasic[]
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

export type { SearchRoute };
