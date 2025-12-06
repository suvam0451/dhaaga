import { ProfileRoute } from './_interface.js';
import { MastoAccount } from '#/types/mastojs.types.js';
import { LibraryPromise } from '#/types/index.js';

export class DefaultProfileRouter implements ProfileRoute {
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
