import { TrendsRoute } from './_interface.js';
import { GetTrendingDTO } from '#/client/types/_interface.js';
import {
	MastoStatus,
	MastoTag,
	MastoTrendLink,
} from '#/types/mastojs.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MastoJsWrapper } from '#/client/utils/api-wrappers.js';

export class MastodonTrendsRouter implements TrendsRoute {
	direct: FetchWrapper;
	client: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MastoJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async tags(): Promise<MastoTag[]> {
		return this.client.lib.v1.trends.tags.list();
	}

	async posts(opts: GetTrendingDTO): Promise<MastoStatus[]> {
		return this.client.lib.v1.trends.statuses.list(opts);
	}

	async links(): Promise<MastoTrendLink[]> {
		return this.client.lib.v1.trends.links.list();
	}
}
