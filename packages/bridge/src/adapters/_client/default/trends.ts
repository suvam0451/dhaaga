import { TrendsRoute } from '../_router/routes/trends.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { GetTrendingDTO } from '../_interface.js';
import { Endpoints } from 'misskey-js';
import { LibraryPromise } from '../_router/routes/_types.js';
import {
	MastoStatus,
	MastoTag,
	MastoTrendLink,
} from '../../../types/mastojs.types.js';
import { LibraryResponse } from '../../../types/result.types.js';

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
