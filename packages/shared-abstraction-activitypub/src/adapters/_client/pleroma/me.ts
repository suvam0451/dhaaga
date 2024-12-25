import { MeRoute } from '../_router/routes/me.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { MastoAccountCredentials } from '../../../types/mastojs.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MegalodonPleromaWrapper } from '../../../custom-clients/custom-clients.js';

export class PleromaMeRouter implements MeRoute {
	direct: FetchWrapper;
	client: MegalodonPleromaWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MegalodonPleromaWrapper.create(
			forwarded.baseUrl,
			forwarded.token,
		);
	}

	async getMe(): LibraryPromise<MastoAccountCredentials> {
		const data = await this.client.client.verifyAccountCredentials();
		// FIXME: incompatible
		return { data: data.data as any };
	}
}
