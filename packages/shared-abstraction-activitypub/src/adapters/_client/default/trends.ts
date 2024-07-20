import { TrendsRoute } from '../_router/routes/trends.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { LibraryResponse } from '../_router/_types.js';
import { MastoStatus, MastoTag, MastoTrendLink } from '../_interface.js';

export class DefaultTrendsRouter implements TrendsRoute {
	async tags(): Promise<LibraryResponse<MastoTag[]>> {
		return notImplementedErrorBuilder();
	}

	async posts(): Promise<LibraryResponse<MastoStatus[]>> {
		return notImplementedErrorBuilder();
	}

	async links(): Promise<LibraryResponse<MastoTrendLink[]>> {
		return notImplementedErrorBuilder();
	}
}
