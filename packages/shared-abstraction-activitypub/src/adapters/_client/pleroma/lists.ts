import { ListsRoute } from '../_router/routes/lists.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMegalodonClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { KNOWN_SOFTWARE } from '../_router/routes/instance.js';
import { MegaList } from '../_interface.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { DhaagaErrorCode } from '../_router/_types.js';

export class PleromaListsRoute implements ListsRoute {
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

	async get(id: string): LibraryPromise<MegaList> {
		const response = await this.lib.client.getList(id);
		if (response.status !== 200) return errorBuilder(response.statusText);
		return { data: response.data };
	}

	async list(): LibraryPromise<MegaList[]> {
		const response = await this.lib.client.getLists();
		if (response.status !== 200) return errorBuilder(response.statusText);
		return { data: response.data };
	}

	async update() {
		return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
	}
}
