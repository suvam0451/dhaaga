import {
	BookmarkGetQueryDTO,
	BookmarksRoute,
} from '../_router/routes/bookmarks.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';

export class DefaultBookmarksRouter implements BookmarksRoute {
	async get(query: BookmarkGetQueryDTO) {
		return notImplementedErrorBuilder();
	}
}
