import {
	DhaagaJsPostSearchDTO,
	DhaagaJsUserSearchDTO,
	SearchRoute,
} from '../_router/routes/search.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import {
	MastoAccount,
	MastoStatus,
	MegaAccount,
	MegaStatus,
} from '../_interface.js';
import { Endpoints } from 'misskey-js';

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
