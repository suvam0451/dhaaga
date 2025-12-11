import { StatusesRoute } from './_interface.js';
import type {
	MastoAccount,
	MastoContext,
	MastoStatus,
} from '#/types/mastojs.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MastoJsWrapper } from '#/client/utils/api-wrappers.js';
import {
	DriverBookmarkStateResult,
	DriverLikeStateResult,
} from '#/types/driver.types.js';
import { PaginatedPromise } from '#/types/api-response.js';
import { DhaagaJsPostCreateDto } from '#/client/typings.js';

export class MastodonStatusesRouter implements StatusesRoute {
	direct: FetchWrapper;
	client: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MastoJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async create(dto: DhaagaJsPostCreateDto): Promise<MastoStatus> {
		return this.client.lib.v1.statuses.create({
			...dto,
			visibility: dto.mastoVisibility,
		});
	}

	async delete(id: string): Promise<{ success: boolean; deleted: boolean }> {
		const data = this.client.lib.v1.statuses.$select(id).remove();
		if (!data) return { success: false, deleted: false };
		return { success: true, deleted: true };
	}

	async getPost(id: string): Promise<MastoStatus> {
		return this.client.lib.v1.statuses.$select(id).fetch();
	}

	async bookmark(id: string): DriverBookmarkStateResult {
		const data = await this.client.lib.v1.statuses.$select(id).bookmark();
		return { state: !!data.bookmarked };
	}

	async unBookmark(id: string): DriverBookmarkStateResult {
		const data = await this.client.lib.v1.statuses.$select(id).unbookmark();
		return { state: !!data.bookmarked };
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

	/**
	 * an extra api call to /relationships is required
	 * to resolve relations
	 */
	async getLikedBy(id: string): PaginatedPromise<MastoAccount[]> {
		const data = await this.client.lib.v1.statuses
			.$select(id)
			.favouritedBy.list();
		return {
			data,
		};
	}

	async getSharedBy(id: string): PaginatedPromise<MastoAccount[]> {
		const data = await this.client.lib.v1.statuses
			.$select(id)
			.rebloggedBy.list();
		return {
			data,
		};
	}

	async getQuotedBy(id: string): PaginatedPromise<MastoStatus[]> {
		return {
			data: [],
		};
	}
}
