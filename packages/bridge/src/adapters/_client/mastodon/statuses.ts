import {
	DhaagaJsPostCreateDto,
	StatusesRoute,
} from '../_router/routes/statuses.js';
import { MastoErrorHandler } from '../_router/_runner.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import type {
	MastoContext,
	MastoScheduledStatus,
	MastoStatus,
} from '../../../types/mastojs.types.js';
import { DhaagaErrorCode } from '../../../types/result.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MastoJsWrapper } from '../../../custom-clients/custom-clients.js';

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

	async delete(id: string): LibraryPromise<MastoStatus> {
		const fn = this.client.lib.v1.statuses.$select(id).remove;
		const { data, error } = await MastoErrorHandler(fn);
		if (error || !data) return errorBuilder(error);
		const retData = await data;
		return { data: retData };
	}

	async get(id: string): LibraryPromise<MastoStatus> {
		const fn = this.client.lib.v1.statuses.$select(id).fetch;
		const { data, error } = await MastoErrorHandler(fn);
		if (error || !data) return errorBuilder(error);
		const retData = await data;
		return { data: retData };
	}

	async bookmark(id: string): LibraryPromise<MastoStatus> {
		const data = await this.client.lib.v1.statuses.$select(id).bookmark();
		return { data };
	}

	async unBookmark(id: string): LibraryPromise<MastoStatus> {
		const data = await this.client.lib.v1.statuses.$select(id).unbookmark();
		return { data };
	}

	async like(id: string): LibraryPromise<MastoStatus> {
		const data = await this.client.lib.v1.statuses.$select(id).favourite();
		return { data };
	}

	async removeLike(id: string): LibraryPromise<MastoStatus> {
		const data = await this.client.lib.v1.statuses.$select(id).unfavourite();
		return { data };
	}

	async getContext(id: string): LibraryPromise<MastoContext> {
		try {
			const ctx = await this.client.lib.v1.statuses.$select(id).context.fetch();
			return { data: ctx };
		} catch (e) {
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	// TODO: other visibilities
	async boost(id: string): LibraryPromise<MastoStatus> {
		const data = await this.client.lib.v1.statuses
			.$select(id)
			.reblog({ visibility: 'public' });
		return { data };
	}

	async removeBoost(id: string): LibraryPromise<MastoStatus> {
		const data = await this.client.lib.v1.statuses.$select(id).unreblog();
		return { data };
	}
}
