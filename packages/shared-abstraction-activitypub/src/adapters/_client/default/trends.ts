import { TrendsRoute } from '../_router/routes/trends.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { LibraryResponse } from '../_router/_types.js';
import {
	GetTrendingDTO,
	MastoStatus,
	MastoTag,
	MastoTrendLink,
} from '../_interface.js';
import { Endpoints } from 'misskey-js';
import { LibraryPromise } from '../_router/routes/_types.js';

export class DefaultTrendsRouter implements TrendsRoute {
	async tags(
		opts: GetTrendingDTO,
	): LibraryPromise<MastoTag[] | Endpoints['hashtags/trend']['res']> {
		return notImplementedErrorBuilder();
	}

	async posts(opts: GetTrendingDTO): Promise<LibraryResponse<MastoStatus[]>> {
		return notImplementedErrorBuilder();
	}

	async links(
		opts: GetTrendingDTO,
	): Promise<LibraryResponse<MastoTrendLink[]>> {
		return notImplementedErrorBuilder();
	}
}
