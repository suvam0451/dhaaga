import { Endpoints } from 'misskey-js';
import { SearchRoute } from './_interface.js';
import { MastoAccount, MastoStatus } from '#/types/mastojs.types.js';
import { MegaAccount, MegaStatus } from '#/types/megalodon.types.js';
import { PaginatedPromise } from '#/types/api-response.js';
import { AppBskyActorDefs } from '@atproto/api';
import {
	DhaagaJsPostSearchDTO,
	DhaagaJsUserSearchDTO,
} from '#/client/typings.js';

export class DefaultSearchRouter implements SearchRoute {
	async findUsers(
		query: DhaagaJsUserSearchDTO,
	): PaginatedPromise<
		| MastoAccount[]
		| Endpoints['users/search']['res']
		| MegaAccount[]
		| AppBskyActorDefs.ProfileViewBasic[]
	> {
		return { data: [] };
	}

	async findPosts(
		q: DhaagaJsPostSearchDTO,
	): PaginatedPromise<
		MastoStatus[] | Endpoints['notes/search']['res'] | MegaStatus[]
	> {
		return { data: [] };
	}
}
