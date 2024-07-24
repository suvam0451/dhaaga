import { DhaagaJsTimelineQueryOptions } from '../_router/routes/timelines.js';
import { TagRoute } from '../_router/routes/tags.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMisskeyClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import {
	PaginatedLibraryPromise,
	LibraryPromise,
} from '../_router/routes/_types.js';
import { MastoTag, MegaTag } from '../_interface.js';
import { Endpoints } from 'misskey-js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { DhaagaErrorCode } from '../_router/_types.js';

export class MisskeyTagsRouter implements TagRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MISSKEYJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMisskeyClient(this.client.url, this.client.accessToken);
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
		const data = await this.lib.client.request<
			'hashtags/show',
			Endpoints['hashtags/show']['req']
		>('hashtags/show', { tag: id });
		return { data };
	}
}
