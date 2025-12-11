import { TrendsRoute } from './_interface.js';
import { GetTrendingDTO } from '#/client/typings.js';
import { Endpoints } from 'misskey-js';
import {
	MastoStatus,
	MastoTag,
	MastoTrendLink,
} from '#/types/mastojs.types.js';

export class DefaultTrendsRouter implements TrendsRoute {
	async tags(
		opts: GetTrendingDTO,
	): Promise<MastoTag[] | Endpoints['hashtags/trend']['res']> {
		throw new Error('Method not supported');
	}

	async posts(opts: GetTrendingDTO): Promise<MastoStatus[]> {
		throw new Error('Method not supported');
	}

	async links(opts: GetTrendingDTO): Promise<MastoTrendLink[]> {
		throw new Error('Method not supported');
	}
}
