import { ListsRoute } from './_interface.js';
import type { MegaList } from '#/types/megalodon.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MegalodonPleromaWrapper } from '#/client/utils/custom-clients.js';

export class PleromaListsRoute implements ListsRoute {
	direct: FetchWrapper;
	client: MegalodonPleromaWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MegalodonPleromaWrapper.create(
			forwarded.baseUrl,
			forwarded.token,
		);
	}

	async get(id: string): Promise<MegaList> {
		const response = await this.client.client.getList(id);
		return response.data;
	}

	async list(): Promise<MegaList[]> {
		const response = await this.client.client.getLists();
		return response.data;
	}

	async update() {
		throw new Error('Method not implemented.');
	}
}
