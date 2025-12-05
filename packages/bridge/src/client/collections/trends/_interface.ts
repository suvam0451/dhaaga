import { GetTrendingDTO } from '../../../adapters/_client/_interface.js';
import { Endpoints } from 'misskey-js';
import { LibraryPromise } from '../../../adapters/_client/_router/routes/_types.js';
import {
	MastoStatus,
	MastoTag,
	MastoTrendLink,
} from '../../../types/mastojs.types.js';

export interface TrendsRoute {
	tags(
		opts: GetTrendingDTO,
	): LibraryPromise<MastoTag[] | Endpoints['hashtags/trend']['res']>;

	posts(opts: GetTrendingDTO): LibraryPromise<MastoStatus[]>;

	links(opts: GetTrendingDTO): LibraryPromise<MastoTrendLink[]>;
}
