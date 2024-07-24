import {
	PaginatedLibraryPromise,
	LibraryPromise,
} from '../_router/routes/_types.js';
import {
	DhaagaJsFollowedTagsQueryOptions,
	TagRoute,
} from '../_router/routes/tags.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMastoClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { MastoTag } from '../_interface.js';
import AppApi from '../../_api/AppApi.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';

export class MastodonTagRouter implements TagRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MASTOJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMastoClient(this.client.url, this.client.accessToken);
	}

	async followedTags(
		query: DhaagaJsFollowedTagsQueryOptions,
	): PaginatedLibraryPromise<MastoTag[]> {
		const { data, error } = await new AppApi(
			this.client.url,
			this.client.accessToken,
		).getCamelCaseWithLinkPagination<MastoTag[]>(
			'/api/v1/followed_tags',
			query,
		);
		if (error || !data) {
			return errorBuilder();
		}
		return { data };
	}

	async follow(id: string): LibraryPromise<MastoTag> {
		const data = await this.lib.client.v1.tags.$select(id).follow();
		return { data };
	}

	async get(id: string): LibraryPromise<MastoTag> {
		const data = await this.lib.client.v1.tags.$select(id).fetch();
		return { data };
	}

	async unfollow(id: string): LibraryPromise<MastoTag> {
		const data = await this.lib.client.v1.tags.$select(id).unfollow();
		return { data };
	}
}
