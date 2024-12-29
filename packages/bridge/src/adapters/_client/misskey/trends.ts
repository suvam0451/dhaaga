import { TrendsRoute } from '../_router/routes/trends.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { Endpoints } from 'misskey-js';
import type {
	MastoStatus,
	MastoTrendLink,
} from '../../../types/mastojs.types.js';
import { LibraryResponse } from '../../../types/result.types.js';
import { MisskeyJsWrapper } from '../../../custom-clients/custom-clients.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';

export class MisskeyTrendsRouter implements TrendsRoute {
	driver: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.driver = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async tags(): LibraryPromise<Endpoints['hashtags/trend']['res']> {
		const data = await this.client.client.request('hashtags/trend', {});
		return { data };
	}

	async posts(): Promise<LibraryResponse<MastoStatus[]>> {
		return notImplementedErrorBuilder();
	}

	async links(): Promise<LibraryResponse<MastoTrendLink[]>> {
		return notImplementedErrorBuilder();
	}
}
