import { TrendsRoute } from '../_router/routes/trends.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	GetTrendingDTO,
	MastoStatus,
	MastoTag,
	MastoTrendLink,
} from '../_interface.js';
import { LibraryResponse } from '../_router/_types.js';
import {
	COMPAT,
	DhaagaMastoClient,
	DhaagaRestClient,
	MastoErrorHandler,
} from '../_router/_runner.js';

export class MastodonTrendsRouter implements TrendsRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MASTOJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMastoClient(this.client.url, this.client.accessToken);
	}

	async tags(): Promise<LibraryResponse<MastoTag[]>> {
		const fn = this.lib.client.v1.trends.tags.list;
		const { data, error } = await MastoErrorHandler(fn);
		if (error) return { error };
		const res = await data;
		return { data: res };
	}

	async posts(opts: GetTrendingDTO): Promise<LibraryResponse<MastoStatus[]>> {
		const fn = this.lib.client.v1.trends.statuses.list;
		const { data, error } = await MastoErrorHandler(fn, [opts]);
		if (error) return { error };
		const res = await data;
		return { data: res };

		// return await new AppApi(
		// 	this.client.url,
		// 	this.client.accessToken,
		// ).getCamelCase<MastoStatus[]>('/api/v1/trends/statuses', opts);
	}

	async links(): Promise<LibraryResponse<MastoTrendLink[]>> {
		const fn = this.lib.client.v1.trends.links.list;
		const { data, error } = await MastoErrorHandler(fn);
		if (error) return { error };
		const res = await data;
		return { data: res };
	}
}
