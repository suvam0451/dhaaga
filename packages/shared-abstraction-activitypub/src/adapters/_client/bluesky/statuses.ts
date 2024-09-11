import {
	DhaagaJsPostCreateDto,
	StatusesRoute,
} from '../_router/routes/statuses.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import {
	MastoContext,
	MastoScheduledStatus,
	MastoStatus,
	MissContext,
	MissNote,
} from '../_interface.js';
import { Endpoints } from 'misskey-js';

class BlueskyStatusesRouter implements StatusesRoute {
	bookmark(
		id: string,
	): LibraryPromise<MastoStatus | Endpoints['notes/favorites/create']['res']> {
		return Promise.resolve(undefined) as any;
	}

	create(dto: DhaagaJsPostCreateDto): LibraryPromise<MastoScheduledStatus> {
		return Promise.resolve(undefined) as any;
	}

	delete(id: string): LibraryPromise<MastoStatus | { success: true }> {
		return Promise.resolve(undefined) as any;
	}

	get(id: string): LibraryPromise<MastoStatus | MissNote> {
		return Promise.resolve(undefined) as any;
	}

	getContext(
		id: string,
		limit?: number,
	): LibraryPromise<MastoContext | MissContext> {
		return Promise.resolve(undefined) as any;
	}

	like(
		id: string,
	): LibraryPromise<MastoStatus | Endpoints['notes/favorites/create']['res']> {
		return Promise.resolve(undefined) as any;
	}

	removeLike(
		id: string,
	): LibraryPromise<MastoStatus | Endpoints['notes/favorites/delete']['res']> {
		return Promise.resolve(undefined) as any;
	}

	unBookmark(
		id: string,
	): LibraryPromise<MastoStatus | Endpoints['notes/favorites/delete']['res']> {
		return Promise.resolve(undefined) as any;
	}
}

export default BlueskyStatusesRouter;
