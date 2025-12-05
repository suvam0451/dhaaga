import { DhaagaJsFollowedTagsQueryOptions, TagRoute } from './_interface.js';
import {
	LibraryPromise,
	PaginatedPromise,
} from '#/adapters/_client/_router/routes/_types.js';
import { Endpoints } from 'misskey-js';
import { MastoTag } from '#/types/mastojs.types.js';
import { MegaTag } from '#/types/megalodon.types.js';

class BlueskyTagsRouter implements TagRoute {
	follow(id: string): LibraryPromise<MastoTag | MegaTag> {
		return Promise.resolve(undefined) as any;
	}

	followedTags(
		query: DhaagaJsFollowedTagsQueryOptions,
	): PaginatedPromise<MastoTag[] | MegaTag[]> {
		return Promise.resolve(undefined) as any;
	}

	get(
		id: string,
	): LibraryPromise<MastoTag | MegaTag | Endpoints['hashtags/show']['res']> {
		return Promise.resolve(undefined) as any;
	}

	unfollow(id: string): LibraryPromise<MastoTag | MegaTag> {
		return Promise.resolve(undefined) as any;
	}
}

export default BlueskyTagsRouter;
