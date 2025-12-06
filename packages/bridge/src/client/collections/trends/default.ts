import { TrendsRoute } from './_interface.js';
import { notImplementedErrorBuilder } from '#/adapters/_client/_router/dto/api-responses.dto.js';
import { GetTrendingDTO } from '#/client/types/_interface.js';
import { Endpoints } from 'misskey-js';
import { LibraryPromise } from '#/adapters/_client/_router/routes/_types.js';
import {
	MastoStatus,
	MastoTag,
	MastoTrendLink,
} from '#/types/mastojs.types.js';
import { LibraryResponse } from '#/types/result.types.js';

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
