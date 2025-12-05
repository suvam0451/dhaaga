import { Endpoints } from 'misskey-js';
import {
	DhaagaJsPostSearchDTO,
	DhaagaJsUserSearchDTO,
	SearchRoute,
} from './_interface.js';
import { LibraryPromise } from '#/adapters/_client/_router/routes/_types.js';
import { MastoAccount, MastoStatus } from '#/types/mastojs.types.js';
import { MegaAccount, MegaStatus } from '#/types/megalodon.types.js';

export class DefaultSearchRouter implements SearchRoute {
	async findUsers(
		query: DhaagaJsUserSearchDTO,
	): LibraryPromise<
		MastoAccount[] | Endpoints['users/search']['res'] | MegaAccount[]
	> {
		return { data: [] };
	}

	async findPosts(
		q: DhaagaJsPostSearchDTO,
	): LibraryPromise<
		MastoStatus[] | Endpoints['notes/search']['res'] | MegaStatus[]
	> {
		return { data: [] };
	}
}
