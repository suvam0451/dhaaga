import { ProfileRoute } from './_interface.js';
import { MastoAccount } from '#/types/mastojs.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MastoJsWrapper } from '#/client/utils/api-wrappers.js';

export class MastodonProfileRouter implements ProfileRoute {
	direct: FetchWrapper;
	client: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MastoJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	followers(): Promise<MastoAccount> {
		throw new Error('Method not implemented.');
	}

	followings(): Promise<MastoAccount> {
		throw new Error('Method not implemented.');
	}

	followRequests(): Promise<MastoAccount> {
		throw new Error('Method not implemented.');
	}
}
