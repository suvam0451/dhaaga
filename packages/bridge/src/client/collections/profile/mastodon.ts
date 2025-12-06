import { LibraryPromise } from '#/adapters/_client/_router/routes/_types.js';
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

	followers(): LibraryPromise<MastoAccount> {
		throw new Error('Method not implemented.');
	}

	followings(): LibraryPromise<MastoAccount> {
		throw new Error('Method not implemented.');
	}

	followRequests(): LibraryPromise<MastoAccount> {
		throw new Error('Method not implemented.');
	}
}
