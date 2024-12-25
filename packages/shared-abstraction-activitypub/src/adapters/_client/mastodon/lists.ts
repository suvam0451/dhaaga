import { LibraryPromise } from '../_router/routes/_types.js';
import { ListsRoute } from '../_router/routes/lists.js';
import type { MastoList } from '../../../types/mastojs.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MastoJsWrapper } from '../../../custom-clients/custom-clients.js';

export class MastodonListRoute implements ListsRoute {
	direct: FetchWrapper;
	client: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MastoJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async update(): LibraryPromise<any> {
		throw new Error('Method not implemented.');
	}

	async get(id: string): LibraryPromise<any> {
		throw new Error('Method not implemented.');
	}

	async list(): LibraryPromise<MastoList[]> {
		const data = await this.client.lib.v1.lists.list();
		return { data };
	}
}
