import { LibraryPromise } from '../_router/routes/_types.js';
import { ListsRoute } from '../_router/routes/lists.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMastoClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { MastoList } from '../_interface.js';

export class MastodonListRoute implements ListsRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MASTOJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMastoClient(this.client.url, this.client.accessToken);
	}

	async update(): LibraryPromise<any> {
		throw new Error('Method not implemented.');
	}

	async get(id: string): LibraryPromise<any> {
		throw new Error('Method not implemented.');
	}

	async list(): LibraryPromise<MastoList[]> {
		const data = await this.lib.client.v1.lists.list();
		return { data };
	}
}
