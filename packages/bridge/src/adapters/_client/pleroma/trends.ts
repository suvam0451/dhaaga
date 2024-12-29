import { TrendsRoute } from '../_router/routes/trends.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import {
	MastoStatus,
	MastoTag,
	MastoTrendLink,
} from '../../../types/mastojs.types.js';
import { LibraryResponse } from '../../../types/result.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';

export class PleromaTrendsRouter implements TrendsRoute {
	client: FetchWrapper;

	constructor(forwarded: FetchWrapper) {
		this.client = forwarded;
	}

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
