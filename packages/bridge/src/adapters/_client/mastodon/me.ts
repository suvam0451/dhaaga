import { MeRoute } from '../_router/routes/me.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { MastoAccountCredentials } from '../../../types/mastojs.types.js';
import { MastoJsWrapper } from '../../../custom-clients/custom-clients.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';

export class MastodonMeRouter implements MeRoute {
	direct: FetchWrapper;
	client: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MastoJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async getMe(): LibraryPromise<MastoAccountCredentials> {
		const result = await this.direct.get<MastoAccountCredentials>(
			'/api/v1/accounts/verify_credentials',
			{
				transformResponse: 'camel',
			},
		);

		if (!result.error) return { data: result.data };

		const data = await this.client.lib.v1.accounts.verifyCredentials();
		console.log('made api call with', this.client);
		return { data };
	}
}
