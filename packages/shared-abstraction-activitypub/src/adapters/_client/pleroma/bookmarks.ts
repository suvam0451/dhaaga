import {
	BookmarkGetQueryDTO,
	BookmarksRoute,
} from '../_router/routes/bookmarks.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMegalodonClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { KNOWN_SOFTWARE } from '../_router/routes/instance.js';

export class PleromaBookmarksRouter implements BookmarksRoute {
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

	async get(query: BookmarkGetQueryDTO) {
		const data = await this.lib.token('ok').client.getBookmarks(query);
		return {
			data: {
				data: data.data,
				minId: null,
				maxId: null,
			},
		};
	}
}
