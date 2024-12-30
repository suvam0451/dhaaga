import { LibraryPromise, PaginatedLibraryPromise } from './_types.js';
import { Endpoints } from 'misskey-js';
import { MastoTag } from '../../../../types/mastojs.types.js';
import { MegaTag } from '../../../../types/megalodon.types.js';

export type DhaagaJsFollowedTagsQueryOptions = {
	limit: number;
	sinceId?: string;
	maxId?: string;
	minId?: string;
};

export interface TagRoute {
	followedTags(
		query: DhaagaJsFollowedTagsQueryOptions,
	): PaginatedLibraryPromise<MastoTag[] | MegaTag[]>;

	follow(id: string): LibraryPromise<MastoTag | MegaTag>;

	get(
		id: string,
	): LibraryPromise<MastoTag | MegaTag | Endpoints['hashtags/show']['res']>;

	unfollow(id: string): LibraryPromise<MastoTag | MegaTag>;
}
