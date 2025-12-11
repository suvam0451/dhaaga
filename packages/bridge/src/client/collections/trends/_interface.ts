import { GetTrendingDTO } from '../../typings.js';
import { Endpoints } from 'misskey-js';
import {
	MastoStatus,
	MastoTag,
	MastoTrendLink,
} from '#/types/mastojs.types.js';
import { AppBskyUnspeccedDefs } from '@atproto/api';

export interface TrendsRoute {
	tags(
		opts: GetTrendingDTO,
	): Promise<
		| MastoTag[]
		| Endpoints['hashtags/trend']['res']
		| AppBskyUnspeccedDefs.TrendView[]
	>;

	posts(opts: GetTrendingDTO): Promise<MastoStatus[]>;

	links(opts: GetTrendingDTO): Promise<MastoTrendLink[]>;
}
