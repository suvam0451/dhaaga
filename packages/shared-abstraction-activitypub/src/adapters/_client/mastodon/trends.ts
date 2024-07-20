import { TrendsRoute } from '../_router/routes/trends.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import AppApi from '../../_api/AppApi.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	GetTrendingPostsQueryDTO,
	MastoStatus,
	MastoTag,
	MastoTrendLink,
} from '../_interface.js';
import { LibraryResponse } from '../_router/_types.js';

export class MastodonTrendsRouter implements TrendsRoute {
	client: RestClient;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
	}

	async tags(): Promise<LibraryResponse<MastoTag[]>> {
		return notImplementedErrorBuilder();
	}

	async posts(
		opts: GetTrendingPostsQueryDTO,
	): Promise<LibraryResponse<MastoStatus[]>> {
		return await new AppApi(
			this.client.url,
			this.client.accessToken,
		).getCamelCase<MastoStatus[]>('/api/v1/trends/statuses', opts);
	}

	async links(): Promise<LibraryResponse<MastoTrendLink[]>> {
		return notImplementedErrorBuilder();
	}
}
