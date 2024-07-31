import { TrendsRoute } from '../_router/routes/trends.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { LibraryResponse } from '../_router/_types.js';
import { MastoStatus, MastoTrendLink } from '../_interface.js';
import {
	COMPAT,
	DhaagaMisskeyClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { Endpoints } from 'misskey-js';

export class MisskeyTrendsRouter implements TrendsRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MISSKEYJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMisskeyClient(this.client.url, this.client.accessToken);
	}

	async tags(): LibraryPromise<Endpoints['hashtags/trend']['res']> {
		const data = await this.lib.client.request('hashtags/trend', {});
		return { data };
	}

	async posts(): Promise<LibraryResponse<MastoStatus[]>> {
		return notImplementedErrorBuilder();
	}

	async links(): Promise<LibraryResponse<MastoTrendLink[]>> {
		return notImplementedErrorBuilder();
	}
}
