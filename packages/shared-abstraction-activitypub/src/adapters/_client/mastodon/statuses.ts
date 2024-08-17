import { DhaagaErrorCode } from '../_router/_types.js';
import {
	DhaagaJsPostCreateDto,
	StatusesRoute,
} from '../_router/routes/statuses.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	MastoContext,
	MastoScheduledStatus,
	MastoStatus,
} from '../_interface.js';
import {
	COMPAT,
	DhaagaMastoClient,
	DhaagaRestClient,
	MastoErrorHandler,
} from '../_router/_runner.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { LibraryPromise } from '../_router/routes/_types.js';

export class MastodonStatusesRouter implements StatusesRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MASTOJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMastoClient(this.client.url, this.client.accessToken);
	}

	async create(
		dto: DhaagaJsPostCreateDto,
	): LibraryPromise<MastoScheduledStatus> {
		const fn = this.lib.client.v1.statuses.create;
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
		const fn = this.lib.client.v1.statuses.$select(id).remove;
		const { data, error } = await MastoErrorHandler(fn);
		if (error || !data) return errorBuilder(error);
		const retData = await data;
		return { data: retData };
	}

	async get(id: string): LibraryPromise<MastoStatus> {
		const fn = this.lib.client.v1.statuses.$select(id).fetch;
		const { data, error } = await MastoErrorHandler(fn);
		if (error || !data) return errorBuilder(error);
		const retData = await data;
		return { data: retData };
	}

	async bookmark(id: string): LibraryPromise<MastoStatus> {
		const data = await this.lib.client.v1.statuses.$select(id).bookmark();
		return { data };
	}

	async unBookmark(id: string): LibraryPromise<MastoStatus> {
		const data = await this.lib.client.v1.statuses.$select(id).unbookmark();
		return { data };
	}

	async like(id: string): LibraryPromise<MastoStatus> {
		const data = await this.lib.client.v1.statuses.$select(id).favourite();
		return { data };
	}

	async removeLike(id: string): LibraryPromise<MastoStatus> {
		const data = await this.lib.client.v1.statuses.$select(id).unfavourite();
		return { data };
	}

	async getContext(id: string): LibraryPromise<MastoContext> {
		try {
			const ctx = await this.lib.client.v1.statuses.$select(id).context.fetch();
			return { data: ctx };
		} catch (e) {
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}
}
