import {
	BookmarkGetQueryDTO,
	BookmarksRoute,
} from '../_router/routes/bookmarks.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { LibraryResponse } from '../_router/_types.js';
import { MastoStatus } from '../_interface.js';

export class DefaultBookmarksRouter implements BookmarksRoute {
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
