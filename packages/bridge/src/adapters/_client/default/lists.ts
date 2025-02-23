import { LibraryPromise } from '../_router/routes/_types.js';
import { ListsRoute } from '../_router/routes/lists.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';

import { ApiErrorCode } from '../../../types/result.types.js';

export class DefaultListRoute implements ListsRoute {
	async update(): LibraryPromise<any> {
		return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
	}
	async get(id: string): LibraryPromise<any> {
		return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
	}
	async list(): LibraryPromise<any[]> {
		return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
	}
}
