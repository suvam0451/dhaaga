import { ListsRoute } from '../_router/routes/lists.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMisskeyClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { DhaagaErrorCode } from '../_router/_types.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { MegaList } from '../_interface.js';
import { Endpoints } from 'misskey-js';

export class MisskeyListsRoute implements ListsRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MISSKEYJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMisskeyClient(this.client.url, this.client.accessToken);
	}

	async get(): LibraryPromise<MegaList> {
		return errorBuilder<MegaList>(DhaagaErrorCode.UNKNOWN_ERROR);
	}

	async list(): LibraryPromise<Endpoints['users/lists/list']['res']> {
		const data = await this.lib.client.request('users/lists/list', {});
		return { data };
	}

	async update() {
		return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
	}

	async listAntennas(): LibraryPromise<Endpoints['antennas/list']['res']> {
		const data = await this.lib.client.request('antennas/list', {});
		return { data };
	}
}
