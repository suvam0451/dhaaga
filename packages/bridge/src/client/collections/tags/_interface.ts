import { Endpoints } from 'misskey-js';
import { MastoTag } from '#/types/mastojs.types.js';
import { MegaTag } from '#/types/megalodon.types.js';
import { PaginatedPromise } from '#/types/api-response.js';

export type DhaagaJsFollowedTagsQueryOptions = {
	limit: number;
	sinceId?: string;
	maxId?: string;
	minId?: string;
};

export interface TagRoute {
	followedTags(
		query: DhaagaJsFollowedTagsQueryOptions,
	): PaginatedPromise<MastoTag[] | MegaTag[]>;

	follow(id: string): Promise<MastoTag | MegaTag>;

	get(
		id: string,
	): Promise<MastoTag | MegaTag | Endpoints['hashtags/show']['res']>;

	unfollow(id: string): Promise<MastoTag | MegaTag>;
}
