import { MeRoute } from './_interface.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MegalodonPleromaWrapper } from '#/client/utils/custom-clients.js';
import type { MegaAccount } from '#/types/megalodon.types.js';

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

	async getMe(): Promise<MegaAccount> {
		const data = await this.client.client.verifyAccountCredentials();
		return data.data;
	}
}
