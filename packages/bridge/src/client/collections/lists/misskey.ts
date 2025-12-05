import { ListsRoute } from './_interface.js';
import { Endpoints } from 'misskey-js';
import { MegaList } from '#/types/megalodon.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MisskeyJsWrapper } from '#/custom-clients/custom-clients.js';

export class MisskeyListsRoute implements ListsRoute {
	direct: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async get(): Promise<MegaList> {
		throw new Error('Method not implemented.');
	}

	async list(): Promise<Endpoints['users/lists/list']['res']> {
		return await this.client.client.request('users/lists/list', {});
	}

	async update() {
		throw new Error('Method not implemented.');
	}

	/**
	 * Extras
	 */

	async listAntennas(): Promise<Endpoints['antennas/list']['res']> {
		return await this.client.client.request('antennas/list', {});
	}
}
