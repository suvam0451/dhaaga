import {
	BookmarkGetQueryDTO,
	BookmarksRoute,
} from '../_router/routes/bookmarks.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import AppApi from '../../_api/AppApi.js';
import { MastoStatus } from '../_interface.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';

export class MastodonBookmarksRouter implements BookmarksRoute {
	client: RestClient;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
	}

	async get(query: BookmarkGetQueryDTO) {
		const { data: _data, error } = await new AppApi(
			this.client.url,
			this.client.accessToken,
		).getCamelCaseWithLinkPagination<MastoStatus[]>('/api/v1/bookmarks', query);

		if (!_data || error) {
			return notImplementedErrorBuilder();
		}
		return {
			data: _data,
		};
	}
}
