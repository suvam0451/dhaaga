import { TrendsRoute } from './_interface.js';
import { Endpoints } from 'misskey-js';
import type { MastoStatus, MastoTrendLink } from '#/types/mastojs.types.js';
import { LibraryResponse } from '#/types/result.types.js';
import { MisskeyJsWrapper } from '#/client/utils/api-wrappers.js';
import FetchWrapper from '#/client/utils/fetch.js';
import {
	LibraryPromise,
	notImplementedErrorBuilder,
} from '#/types/api-response.js';

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
