import { MeRoute } from '../_router/routes/me.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMegalodonClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { KNOWN_SOFTWARE } from '../_router/instance.js';
import { MastoAccountCredentials } from '../_interface.js';
import { LibraryPromise } from '../_router/routes/_types.js';

export class PleromaMeRouter implements MeRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MEGALODON>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMegalodonClient(
			KNOWN_SOFTWARE.PLEROMA,
			this.client.url,
			this.client.accessToken,
		);
	}

	async getMe(): LibraryPromise<MastoAccountCredentials> {
		const data = await this.lib.client.verifyAccountCredentials();
		// FIXME: incompatible
		return { data: data.data as any };
	}
}
