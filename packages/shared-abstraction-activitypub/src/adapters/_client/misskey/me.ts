import { MeRoute } from '../_router/routes/me.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMisskeyClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { Endpoints } from 'misskey-js';

export class MisskeyMeRouter implements MeRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MISSKEYJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMisskeyClient(this.client.url, this.client.accessToken);
	}

	async getMe(): LibraryPromise<Endpoints['i']['res']> {
		const data = await this.lib.client.request<'i', Endpoints['i']['req']>(
			'i',
			{},
		);
		return { data };
	}
}
