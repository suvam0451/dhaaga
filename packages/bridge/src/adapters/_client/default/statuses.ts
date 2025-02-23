import {
	DhaagaJsPostCreateDto,
	StatusesRoute,
} from '../_router/routes/statuses.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { Endpoints } from 'misskey-js';
import {
	MastoContext,
	MastoScheduledStatus,
	MastoStatus,
} from '../../../types/mastojs.types.js';
import { MissContext } from '../../../types/misskey-js.types.js';
import { ApiErrorCode, LibraryResponse } from '../../../types/result.types.js';
import { DriverLikeStateResult } from '../../../types/driver.types.js';
import { Err } from '../../../utils/index.js';

export class DefaultStatusesRouter implements StatusesRoute {
	async get(id: string): Promise<LibraryResponse<MastoStatus>> {
		return {
			error: {
				code: ApiErrorCode.FEATURE_UNSUPPORTED,
			},
		};
	}

	async create(
		dto: DhaagaJsPostCreateDto,
	): LibraryPromise<MastoScheduledStatus> {
		return notImplementedErrorBuilder<MastoScheduledStatus>();
	}

	async delete(id: string): Promise<{ success: boolean; deleted: boolean }> {
		return { success: false, deleted: false };
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

	async like(id: string): DriverLikeStateResult {
		return Err(ApiErrorCode.OPERATION_UNSUPPORTED);
	}

	async removeLike(id: string): DriverLikeStateResult {
		return Err(ApiErrorCode.OPERATION_UNSUPPORTED);
	}

	async getContext(id: string): LibraryPromise<MastoContext | MissContext> {
		return notImplementedErrorBuilder<any>();
	}
}
