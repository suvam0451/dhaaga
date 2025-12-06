import { TrendsRoute } from './_interface.js';
import {
	MastoStatus,
	MastoTag,
	MastoTrendLink,
} from '#/types/mastojs.types.js';
import { LibraryResponse } from '#/types/result.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { notImplementedErrorBuilder } from '#/types/api-response.js';

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
