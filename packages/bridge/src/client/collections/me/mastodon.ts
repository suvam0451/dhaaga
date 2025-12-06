import { MeRoute } from './_interface.js';
import { MastoAccountCredentials } from '#/types/mastojs.types.js';
import { MastoJsWrapper } from '#/client/utils/custom-clients.js';
import FetchWrapper from '#/client/utils/fetch.js';

export class MastodonMeRouter implements MeRoute {
	direct: FetchWrapper;
	client: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MastoJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async getMe(): Promise<MastoAccountCredentials> {
		return this.client.lib.v1.accounts.verifyCredentials();
	}
}
