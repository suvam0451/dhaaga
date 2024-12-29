import { TagRoute } from '../_router/routes/tags.js';
import {
	PaginatedLibraryPromise,
	LibraryPromise,
} from '../_router/routes/_types.js';
import { Endpoints } from 'misskey-js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import type { MastoTag } from '../../../types/mastojs.types.js';
import { DhaagaErrorCode } from '../../../types/result.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MisskeyJsWrapper } from '../../../custom-clients/custom-clients.js';

export class MisskeyTagsRouter implements TagRoute {
	direct: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	/**
	 * Misskey and it's forks do not support hashtag following
	 */
	async followedTags(): PaginatedLibraryPromise<MastoTag[]> {
		return { data: { data: [] } };
	}

	async follow(id: string): LibraryPromise<MastoTag> {
		return errorBuilder<MastoTag>(DhaagaErrorCode.OPERATION_UNSUPPORTED);
	}

	async unfollow(id: string): LibraryPromise<MastoTag> {
		return errorBuilder<MastoTag>(DhaagaErrorCode.OPERATION_UNSUPPORTED);
	}

	async get(id: string): LibraryPromise<Endpoints['hashtags/show']['res']> {
		const data = await this.client.client.request<
			'hashtags/show',
			Endpoints['hashtags/show']['req']
		>('hashtags/show', { tag: id });
		return { data };
	}

	async getTrend(
		id: string,
	): LibraryPromise<Endpoints['hashtags/trend']['res']> {
		const data = await this.client.client.request('hashtags/trend', {
			tag: id,
		});
		return { data };
	}
}
