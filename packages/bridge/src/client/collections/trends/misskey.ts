import { TrendsRoute } from './_interface.js';
import { Endpoints } from 'misskey-js';
import type { MastoStatus, MastoTrendLink } from '#/types/mastojs.types.js';
import { MisskeyJsWrapper } from '#/client/utils/api-wrappers.js';
import FetchWrapper from '#/client/utils/fetch.js';

export class MisskeyTrendsRouter implements TrendsRoute {
	driver: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.driver = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async tags(): Promise<Endpoints['hashtags/trend']['res']> {
		return this.client.client.request('hashtags/trend', {});
	}

	async posts(): Promise<MastoStatus[]> {
		throw new Error('method not implemented');
	}

	async links(): Promise<MastoTrendLink[]> {
		throw new Error('method not implemented');
	}
}
