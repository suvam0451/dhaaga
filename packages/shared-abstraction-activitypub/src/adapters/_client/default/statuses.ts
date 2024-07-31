import { DhaagaErrorCode, LibraryResponse } from '../_router/_types.js';
import { StatusesRoute } from '../_router/routes/statuses.js';
import { MastoContext, MastoStatus, MissContext } from '../_interface.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { Endpoints } from 'misskey-js';

export class DefaultStatusesRouter implements StatusesRoute {
	async get(id: string): Promise<LibraryResponse<MastoStatus>> {
		return {
			error: {
				code: DhaagaErrorCode.FEATURE_UNSUPPORTED,
			},
		};
	}

	async bookmark(
		id: string,
	): LibraryPromise<MastoStatus | Endpoints['notes/favorites/create']['res']> {
		return notImplementedErrorBuilder<any>();
	}

	async unBookmark(
		id: string,
	): LibraryPromise<MastoStatus | Endpoints['notes/favorites/delete']['res']> {
		return notImplementedErrorBuilder<any>();
	}

	async getContext(id: string): LibraryPromise<MastoContext | MissContext> {
		return notImplementedErrorBuilder<any>();
	}
}
