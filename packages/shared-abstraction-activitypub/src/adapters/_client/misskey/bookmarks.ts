import { StatusesRoute } from '../_router/routes/statuses.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { DhaagaErrorCode, LibraryResponse } from '../_router/_types.js';
import {
	errorBuilder,
	notImplementedErrorBuilder,
} from '../_router/dto/api-responses.dto.js';
import { MastoStatus } from '../_interface.js';
import {
	BookmarkGetQueryDTO,
	BookmarksRoute,
} from '../_router/routes/bookmarks.js';
import { Endpoints } from 'misskey-js';
import {
	COMPAT,
	DhaagaMisskeyClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import AppApi from '../../_api/AppApi.js';

export class MisskeyBookmarksRouter implements BookmarksRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MISSKEYJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMisskeyClient(this.client.url, this.client.accessToken);
	}

	/**
	 * /i/favourites seems bugged when
	 * using misskey-js
	 * @param query
	 */
	async get(query: BookmarkGetQueryDTO): Promise<
		LibraryResponse<{
			data: Endpoints['i/favorites']['res'];
			minId?: string | null;
			maxId?: string | null;
		}>
	> {
		try {
			const { data, error } = await new AppApi(
				this.client.url,
				this.client.accessToken,
			).post<Endpoints['i/favorites']['res']>(
				'/api/i/favorites',
				{
					...query,
					allowPartial: true,
					limit: query.limit,
					untilId: query.maxId,
				},
				{},
			);

			if (error) {
				return {
					data: {
						data: [],
					},
				};
			}

			let maxId = null;
			let minId = null;

			if (data.length > 0) {
				maxId = data[data.length - 1].id;
				minId = data[0].id;
			}
			return {
				data: {
					data,
					maxId,
					minId,
				},
			};
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(DhaagaErrorCode.UNAUTHORIZED);
			}
			console.log('Error', e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}
}
