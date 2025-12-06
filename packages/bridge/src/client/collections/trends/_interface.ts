import { GetTrendingDTO } from '../../types/_interface.js';
import { Endpoints } from 'misskey-js';
import {
	MastoStatus,
	MastoTag,
	MastoTrendLink,
} from '../../../types/mastojs.types.js';
import { LibraryPromise } from '#/types/index.js';

export interface TrendsRoute {
	tags(
		opts: GetTrendingDTO,
	): LibraryPromise<MastoTag[] | Endpoints['hashtags/trend']['res']>;

	posts(opts: GetTrendingDTO): LibraryPromise<MastoStatus[]>;

	links(opts: GetTrendingDTO): LibraryPromise<MastoTrendLink[]>;
}
