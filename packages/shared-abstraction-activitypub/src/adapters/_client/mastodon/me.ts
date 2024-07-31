import { MeRoute } from '../_router/routes/me.js';
import { MastoAccountCredentials } from '../_interface.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMastoClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { LibraryPromise } from '../_router/routes/_types.js';

export class MastodonMeRouter implements MeRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MASTOJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMastoClient(this.client.url, this.client.accessToken);
	}

	async getMe(): LibraryPromise<MastoAccountCredentials> {
		const data = await this.lib.client.v1.accounts.verifyCredentials();
		return { data };
	}
}
