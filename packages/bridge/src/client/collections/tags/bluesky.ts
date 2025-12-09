import { DhaagaJsFollowedTagsQueryOptions, TagRoute } from './_interface.js';
import { Endpoints } from 'misskey-js';
import { MastoTag } from '#/types/mastojs.types.js';
import { MegaTag } from '#/types/megalodon.types.js';
import { PaginatedPromise } from '#/types/api-response.js';

class BlueskyTagsRouter implements TagRoute {
	follow(id: string): Promise<MastoTag | MegaTag> {
		return Promise.resolve(undefined) as any;
	}

	followedTags(
		query: DhaagaJsFollowedTagsQueryOptions,
	): PaginatedPromise<MastoTag[] | MegaTag[]> {
		return Promise.resolve(undefined) as any;
	}

	get(
		id: string,
	): Promise<MastoTag | MegaTag | Endpoints['hashtags/show']['res']> {
		return Promise.resolve(undefined) as any;
	}

	unfollow(id: string): Promise<MastoTag | MegaTag> {
		return Promise.resolve(undefined) as any;
	}
}

export default BlueskyTagsRouter;
