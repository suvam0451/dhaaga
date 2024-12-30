import { ListsRoute } from '../_router/routes/lists.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { Endpoints } from 'misskey-js';
import { MegaList } from '../../../types/megalodon.types.js';
import { DhaagaErrorCode } from '../../../types/result.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MisskeyJsWrapper } from '../../../custom-clients/custom-clients.js';

export class MisskeyListsRoute implements ListsRoute {
	direct: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async get(): LibraryPromise<MegaList> {
		return errorBuilder<MegaList>(DhaagaErrorCode.UNKNOWN_ERROR);
	}

	async list(): LibraryPromise<Endpoints['users/lists/list']['res']> {
		const data = await this.client.client.request('users/lists/list', {});
		return { data };
	}

	async update() {
		return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
	}

	async listAntennas(): LibraryPromise<Endpoints['antennas/list']['res']> {
		const data = await this.client.client.request('antennas/list', {});
		return { data };
	}
}
