import { DhaagaJsFollowedTagsQueryOptions, TagRoute } from './_interface.js';
import FetchWrapper from '#/client/utils/fetch.js';
import type { MastoTag } from '#/types/mastojs.types.js';
import { MastoJsWrapper } from '#/client/utils/api-wrappers.js';
import { PaginatedPromise } from '#/types/api-response.js';

export class MastodonTagRouter implements TagRoute {
	direct: FetchWrapper;
	client: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MastoJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async followedTags(
		query: DhaagaJsFollowedTagsQueryOptions,
	): PaginatedPromise<MastoTag[]> {
		return this.direct.getCamelCaseWithLinkPagination<MastoTag[]>(
			'/api/v1/followed_tags',
			query,
		);
	}

	async follow(id: string): Promise<MastoTag> {
		return this.client.lib.v1.tags.$select(id).follow();
	}

	async get(id: string): Promise<MastoTag> {
		return this.client.lib.v1.tags.$select(id).fetch();
	}

	async unfollow(id: string): Promise<MastoTag> {
		return this.client.lib.v1.tags.$select(id).unfollow();
	}
}
