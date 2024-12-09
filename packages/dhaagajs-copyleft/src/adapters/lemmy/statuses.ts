import {
	LibraryPromise,
	MastoStatus,
	StatusesRoute,
} from '@dhaaga/shared-abstraction-activitypub';
import { DhaagaJsPostCreateDto } from '@dhaaga/shared-abstraction-activitypub/adapters/_client/_router/routes/statuses.js';
import {
	MastoContext,
	MastoScheduledStatus,
	MissContext,
	MissNote,
} from '@dhaaga/shared-abstraction-activitypub/adapters/_client/_interface.js';

export class LemmyStatusesRouter implements StatusesRoute {
	bookmark(
		id: string,
	): LibraryPromise<MastoStatus | Endpoints['notes/favorites/create']['res']> {
		return Promise.resolve(undefined);
	}

	create(
		dto: DhaagaJsPostCreateDto,
	): LibraryPromise<MastoScheduledStatus | { uri: string; cid: string }> {
		return Promise.resolve(undefined);
	}

	delete(id: string): LibraryPromise<MastoStatus | { success: true }> {
		return Promise.resolve(undefined);
	}

	get(id: string): LibraryPromise<MastoStatus | MissNote | Response> {
		return Promise.resolve(undefined);
	}

	getContext(
		id: string,
		limit?: number,
	): LibraryPromise<MastoContext | MissContext | Response> {
		return Promise.resolve(undefined);
	}

	like(
		id: string,
	): LibraryPromise<MastoStatus | Endpoints['notes/favorites/create']['res']> {
		return Promise.resolve(undefined);
	}

	removeLike(
		id: string,
	): LibraryPromise<MastoStatus | Endpoints['notes/favorites/delete']['res']> {
		return Promise.resolve(undefined);
	}

	unBookmark(
		id: string,
	): LibraryPromise<MastoStatus | Endpoints['notes/favorites/delete']['res']> {
		return Promise.resolve(undefined);
	}
}
