import { TrendsRoute } from './_interface.js';
import { GetTrendingDTO } from '#/client/types/_interface.js';
import { Endpoints } from 'misskey-js';
import {
	MastoStatus,
	MastoTag,
	MastoTrendLink,
} from '#/types/mastojs.types.js';
import { LibraryPromise } from '#/types/index.js';

class BlueskyTrendsRouter implements TrendsRoute {
	links(opts: GetTrendingDTO): LibraryPromise<MastoTrendLink[]> {
		return Promise.resolve([]) as any;
	}

	posts(opts: GetTrendingDTO): LibraryPromise<MastoStatus[]> {
		return Promise.resolve([]) as any;
	}

	tags(
		opts: GetTrendingDTO,
	): LibraryPromise<MastoTag[] | Endpoints['hashtags/trend']['res']> {
		return Promise.resolve(undefined) as any;
	}
}

export default BlueskyTrendsRouter;
