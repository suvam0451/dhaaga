import { TrendsRoute } from '../_router/routes/trends.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { LibraryResponse } from '../_router/_types.js';
import { MastoStatus, MastoTag, MastoTrendLink } from '../_interface.js';

export class PleromaTrendsRouter implements TrendsRoute {
	client: RestClient;

	constructor(forwarded: RestClient) {
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
