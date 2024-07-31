import {
	GetTrendingDTO,
	MastoStatus,
	MastoTag,
	MastoTrendLink,
} from '../../_interface.js';
import { Endpoints } from 'misskey-js';
import { LibraryPromise } from './_types.js';

export interface TrendsRoute {
	tags(
		opts: GetTrendingDTO,
	): LibraryPromise<MastoTag[] | Endpoints['hashtags/trend']['res']>;

	posts(opts: GetTrendingDTO): LibraryPromise<MastoStatus[]>;

	links(opts: GetTrendingDTO): LibraryPromise<MastoTrendLink[]>;
}
