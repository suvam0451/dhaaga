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

class BlueskySearchRouter implements SearchRoute {
	findPosts(
		q: DhaagaJsPostSearchDTO,
	): LibraryPromise<
		MastoStatus[] | Endpoints['notes/search']['res'] | MegaStatus[]
	> {
		return Promise.resolve(undefined) as any;
	}

	findUsers(
		q: DhaagaJsUserSearchDTO,
	): LibraryPromise<
		MastoAccount[] | Endpoints['users/search']['res'] | MegaAccount[]
	> {
		return Promise.resolve(undefined) as any;
	}
}

export default BlueskySearchRouter;
