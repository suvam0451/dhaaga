import {
	PaginatedPromise,
	LibraryPromise,
} from '#/adapters/_client/_router/routes/_types.js';
import { DhaagaJsFollowedTagsQueryOptions, TagRoute } from './_interface.js';
import FetchWrapper from '#/client/utils/fetch.js';
import type { MastoTag } from '#/types/mastojs.types.js';
import { MastoJsWrapper } from '#/custom-clients/custom-clients.js';

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

	async follow(id: string): LibraryPromise<MastoTag> {
		const data = await this.client.lib.v1.tags.$select(id).follow();
		return { data };
	}

	async get(id: string): LibraryPromise<MastoTag> {
		const data = await this.client.lib.v1.tags.$select(id).fetch();
		return { data };
	}

	async unfollow(id: string): LibraryPromise<MastoTag> {
		const data = await this.client.lib.v1.tags.$select(id).unfollow();
		return { data };
	}
}
