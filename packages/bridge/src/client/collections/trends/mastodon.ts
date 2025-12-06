import { TrendsRoute } from './_interface.js';
import { GetTrendingDTO } from '#/client/types/_interface.js';
import {
	MastoStatus,
	MastoTag,
	MastoTrendLink,
} from '#/types/mastojs.types.js';
import { LibraryResponse } from '#/types/result.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MastoJsWrapper } from '#/client/utils/api-wrappers.js';
import { MastoErrorHandler } from '#/client/utils/api-wrappers.js';

export class MastodonTrendsRouter implements TrendsRoute {
	direct: FetchWrapper;
	client: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MastoJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async tags(): Promise<LibraryResponse<MastoTag[]>> {
		const fn = this.client.lib.v1.trends.tags.list;
		const { data, error } = await MastoErrorHandler(fn);
		if (error) return { error };
		const res = await data;
		return { data: res };
	}

	async posts(opts: GetTrendingDTO): Promise<LibraryResponse<MastoStatus[]>> {
		const fn = this.client.lib.v1.trends.statuses.list;
		const { data, error } = await MastoErrorHandler(fn, [opts]);
		if (error) return { error };
		const res = await data;
		return { data: res };
	}

	async links(): Promise<LibraryResponse<MastoTrendLink[]>> {
		const fn = this.client.lib.v1.trends.links.list;
		const { data, error } = await MastoErrorHandler(fn);
		if (error) return { error };
		const res = await data;
		return { data: res };
	}
}
