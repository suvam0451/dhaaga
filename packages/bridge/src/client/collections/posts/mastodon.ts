import { DhaagaJsPostCreateDto, StatusesRoute } from './_interface.js';
import type {
	MastoContext,
	MastoScheduledStatus,
	MastoStatus,
} from '#/types/mastojs.types.js';
import { ApiErrorCode } from '#/types/result.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MastoJsWrapper } from '#/client/utils/api-wrappers.js';
import { Err, Ok } from '#/utils/index.js';
import {
	DriverBookmarkStateResult,
	DriverLikeStateResult,
} from '#/types/driver.types.js';
import { MastoErrorHandler } from '#/client/utils/api-wrappers.js';
import { errorBuilder, LibraryPromise } from '#/types/index.js';

export class MastodonStatusesRouter implements StatusesRoute {
	direct: FetchWrapper;
	client: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MastoJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async create(
		dto: DhaagaJsPostCreateDto,
	): LibraryPromise<MastoScheduledStatus> {
		const fn = this.client.lib.v1.statuses.create;
		const { data, error } = await MastoErrorHandler(fn, [
			{
				...dto,
				visibility: dto.mastoVisibility,
			},
		]);
		if (error || !data) return errorBuilder(error);
		const retData = await data;
		return { data: retData };
	}

	async delete(id: string): Promise<{ success: boolean; deleted: boolean }> {
		const fn = this.client.lib.v1.statuses.$select(id).remove;
		const { data, error } = await MastoErrorHandler(fn);
		if (error || !data) return { success: false, deleted: false };
		return { success: true, deleted: true };
	}

	async getPost(id: string): LibraryPromise<MastoStatus> {
		const fn = this.client.lib.v1.statuses.$select(id).fetch;
		const { data, error } = await MastoErrorHandler(fn);
		if (error || !data) return errorBuilder(error);
		const retData = await data;
		return { data: retData };
	}

	async bookmark(id: string): DriverBookmarkStateResult {
		try {
			const data = await this.client.lib.v1.statuses.$select(id).bookmark();
			return Ok({ state: !!data.bookmarked });
		} catch (e) {
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	async unBookmark(id: string): DriverBookmarkStateResult {
		try {
			const data = await this.client.lib.v1.statuses.$select(id).unbookmark();
			return Ok({ state: !!data.bookmarked });
		} catch (e) {
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	async like(id: string): DriverLikeStateResult {
		const data = await this.client.lib.v1.statuses.$select(id).favourite();
		return { state: !!data.favourited, counter: data.favouritesCount };
	}

	async removeLike(id: string): DriverLikeStateResult {
		const data = await this.client.lib.v1.statuses.$select(id).unfavourite();
		return { state: !!data.favourited, counter: data.favouritesCount };
	}

	async getPostContext(id: string): Promise<MastoContext> {
		return this.client.lib.v1.statuses.$select(id).context.fetch();
	}

	// TODO: other visibilities
	async boost(id: string): Promise<MastoStatus> {
		return this.client.lib.v1.statuses
			.$select(id)
			.reblog({ visibility: 'public' });
	}

	async removeBoost(id: string): Promise<MastoStatus> {
		return this.client.lib.v1.statuses.$select(id).unreblog();
	}
}
