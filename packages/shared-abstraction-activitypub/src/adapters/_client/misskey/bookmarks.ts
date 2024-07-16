import { StatusesRoute } from '../_router/routes/statuses.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { LibraryResponse } from '../_router/_types.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { MastoStatus } from '../_interface.js';
import {
	BookmarkGetQueryDTO,
	BookmarksRoute,
} from '../_router/routes/bookmarks.js';

export class MisskeyBookmarksRouter implements BookmarksRoute {
	client: RestClient;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
	}

	async get(query: BookmarkGetQueryDTO): Promise<
		LibraryResponse<{
			data: MastoStatus[];
			minId?: string | null;
			maxId?: string | null;
		}>
	> {
		return notImplementedErrorBuilder();
	}
}
