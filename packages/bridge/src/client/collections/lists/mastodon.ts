import { ListsRoute } from './_interface.js';
import type { MastoList } from '#/types/mastojs.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MastoJsWrapper } from '#/client/utils/api-wrappers.js';

export class MastodonListRoute implements ListsRoute {
	direct: FetchWrapper;
	client: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MastoJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async update(): Promise<any> {
		throw new Error('Method not implemented.');
	}

	async get(id: string): Promise<any> {
		throw new Error('Method not implemented.');
	}

	async list(): Promise<MastoList[]> {
		return await this.client.lib.v1.lists.list();
	}
}
