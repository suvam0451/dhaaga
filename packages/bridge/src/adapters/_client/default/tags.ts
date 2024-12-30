import {
	PaginatedLibraryPromise,
	LibraryPromise,
} from '../_router/routes/_types.js';
import { TagRoute } from '../_router/routes/tags.js';

import { MastoTag } from '../../../types/mastojs.types.js';

export class DefaultTagRouter implements TagRoute {
	async followedTags(): PaginatedLibraryPromise<MastoTag[]> {
		return { data: { data: [] } };
	}

	async follow(): LibraryPromise<MastoTag> {
		throw new Error('Method not implemented.');
	}

	async get(): LibraryPromise<MastoTag> {
		throw new Error('Method not implemented.');
	}

	async unfollow(): LibraryPromise<MastoTag> {
		throw new Error('Method not implemented.');
	}
}
