import { TrendsRoute } from './_interface.js';
import { notImplementedErrorBuilder } from '#/adapters/_client/_router/dto/api-responses.dto.js';
import {
	MastoStatus,
	MastoTag,
	MastoTrendLink,
} from '#/types/mastojs.types.js';
import { LibraryResponse } from '#/types/result.types.js';
import FetchWrapper from '#/client/utils/fetch.js';

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
