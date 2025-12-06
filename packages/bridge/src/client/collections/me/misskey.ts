import { MeRoute } from './_interface.js';
import { Endpoints } from 'misskey-js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MisskeyJsWrapper } from '#/client/utils/api-wrappers.js';

export class MisskeyMeRouter implements MeRoute {
	direct: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async getMe(): Promise<Endpoints['i']['res']> {
		return this.client.client.request<'i', Endpoints['i']['req']>('i', {});
	}
}
