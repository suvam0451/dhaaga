import { LibraryPromise } from '#/adapters/_client/_router/routes/_types.js';
import { ProfileRoute } from './_interface.js';
import { MastoAccount } from '#/types/mastojs.types.js';

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
