import { ListsRoute } from '../_router/routes/lists.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import type { MegaList } from '../../../types/megalodon.types.js';
import { DhaagaErrorCode } from '../../../types/result.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MegalodonPleromaWrapper } from '../../../custom-clients/custom-clients.js';

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

	async get(id: string): LibraryPromise<MegaList> {
		const response = await this.client.client.getList(id);
		if (response.status !== 200) return errorBuilder(response.statusText);
		return { data: response.data };
	}

	async list(): LibraryPromise<MegaList[]> {
		const response = await this.client.client.getLists();
		if (response.status !== 200) return errorBuilder(response.statusText);
		return { data: response.data };
	}

	async update() {
		return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
	}
}
