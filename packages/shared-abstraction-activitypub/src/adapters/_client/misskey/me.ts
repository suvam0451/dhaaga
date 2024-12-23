import { MeRoute } from '../_router/routes/me.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { Endpoints } from 'misskey-js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MisskeyJsWrapper } from '../../../custom-clients/custom-clients.js';

export class MisskeyMeRouter implements MeRoute {
	direct: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async getMe(): LibraryPromise<Endpoints['i']['res']> {
		const data = await this.client.client.request<'i', Endpoints['i']['req']>(
			'i',
			{},
		);
		return { data };
	}
}
