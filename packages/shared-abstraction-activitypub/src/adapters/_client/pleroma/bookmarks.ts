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
import AppApi from '../../_api/AppApi.js';
import { MastoStatus } from '../_interface.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { LibraryPromise } from '../_router/routes/_types.js';

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

	async get(query: BookmarkGetQueryDTO): LibraryPromise<{
		data: MastoStatus[];
		minId?: string | null;
		maxId?: string | null;
	}> {
		// Works, but not ideal
		// const data = await this.lib.client.getBookmarks(query);
		// return {
		// 	data: {
		// 		data: data.data,
		// 		minId: null,
		// 		maxId: null,
		// 	},
		// };

		const { data: _data, error } = await new AppApi(
			this.client.url,
			this.client.accessToken,
		).getCamelCaseWithLinkPagination<MastoStatus[]>('/api/v1/bookmarks', query);

		if (!_data || error) {
			return notImplementedErrorBuilder<{
				data: MastoStatus[];
				minId: string | null;
				maxId: string | null;
			}>();
		}
		return {
			data: _data,
		};
	}
}
