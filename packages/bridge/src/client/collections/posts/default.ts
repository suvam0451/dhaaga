import { DhaagaJsPostCreateDto, StatusesRoute } from './_interface.js';
import {
	MastoContext,
	MastoScheduledStatus,
	MastoStatus,
} from '#/types/mastojs.types.js';
import { MissContext } from '#/types/misskey-js.types.js';
import {
	DriverBookmarkStateResult,
	DriverLikeStateResult,
} from '#/types/driver.types.js';
import { LibraryPromise } from '#/types/index.js';

export class DefaultStatusesRouter implements StatusesRoute {
	async getPost(id: string): Promise<MastoStatus> {
		throw new Error('not supported by driver');
	}

	async create(
		dto: DhaagaJsPostCreateDto,
	): LibraryPromise<MastoScheduledStatus> {
		throw new Error('not supported by driver');
	}

	async delete(id: string): Promise<{ success: boolean; deleted: boolean }> {
		throw new Error('not supported by driver');
	}

	async bookmark(id: string): DriverBookmarkStateResult {
		throw new Error('not supported by driver');
	}

	async unBookmark(id: string): DriverBookmarkStateResult {
		throw new Error('not supported by driver');
	}

	async like(id: string): DriverLikeStateResult {
		throw new Error('not supported by driver');
	}

	async removeLike(id: string): DriverLikeStateResult {
		throw new Error('not supported by driver');
	}

	async getPostContext(id: string): Promise<MastoContext | MissContext> {
		throw new Error('not supported by driver');
	}
}
