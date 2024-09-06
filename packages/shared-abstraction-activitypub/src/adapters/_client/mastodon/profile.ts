import { LibraryPromise } from '../_router/routes/_types.js';
import { ProfileRoute } from '../_router/routes/profile.js';
import { MastoAccount } from '../_interface.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMastoClient,
	DhaagaRestClient,
} from '../_router/_runner.js';

export class MastodonProfileRouter implements ProfileRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MASTOJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMastoClient(this.client.url, this.client.accessToken);
	}

	followers(): LibraryPromise<MastoAccount> {
		throw new Error('Method not implemented.');
	}

	followings(): LibraryPromise<MastoAccount> {
		throw new Error('Method not implemented.');
	}

	followRequests(): LibraryPromise<MastoAccount> {
		throw new Error('Method not implemented.');
	}
}
