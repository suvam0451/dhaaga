import { LibraryResponse } from '../_router/_types.js';
import { StatusesRoute } from '../_router/routes/statuses.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { MastoStatus } from '../_interface.js';
import {
	COMPAT,
	DhaagaMastoClient,
	DhaagaRestClient,
	MastoErrorHandler,
} from '../_router/_runner.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { LibraryPromise } from '../_router/routes/_types.js';

export class MastodonStatusesRouter implements StatusesRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MASTOJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMastoClient(this.client.url, this.client.accessToken);
	}

	async get(id: string): Promise<LibraryResponse<MastoStatus>> {
		const fn = this.lib.client.v1.statuses.$select(id).fetch;
		const { data, error } = await MastoErrorHandler(fn);
		if (error || !data) return errorBuilder();
		const retData = await data;
		return { data: retData };
	}

	async bookmark(id: string): LibraryPromise<MastoStatus> {
		const data = await this.lib.client.v1.statuses.$select(id).bookmark();
		return { data };
	}

	async unBookmark(id: string): LibraryPromise<MastoStatus> {
		const data = await this.lib.client.v1.statuses.$select(id).unbookmark();
		return { data };
	}
}
