import {
	PaginatedLibraryPromise,
	LibraryPromise,
} from '../_router/routes/_types.js';
import { TagRoute } from '../_router/routes/tags.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMegalodonClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { KNOWN_SOFTWARE } from '../_router/routes/instance.js';
import { MegaTag } from '../_interface.js';

export class PleromaTagsRouter implements TagRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MEGALODON>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMegalodonClient(
			KNOWN_SOFTWARE.PLEROMA,
			this.client.url,
			this.client.accessToken,
		);
	}

	async followedTags(): PaginatedLibraryPromise<MegaTag[]> {
		const data = await this.lib.client.getFollowedTags();
		console.log('[headers]', data.headers);

		return {
			data: {
				data: data.data,
			},
		};
	}

	async follow(id: string): LibraryPromise<MegaTag> {
		const data = await this.lib.client.followTag(id);
		return { data: data.data };
	}

	async get(id: string): LibraryPromise<MegaTag> {
		const data = await this.lib.client.getTag(id);
		return { data: data.data };
	}

	async unfollow(id: string): LibraryPromise<MegaTag> {
		const data = await this.lib.client.unfollowTag(id);
		return { data: data.data };
	}
}
