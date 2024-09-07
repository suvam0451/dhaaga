import { LibraryPromise } from '../_router/routes/_types.js';
import { ProfileRoute } from '../_router/routes/profile.js';
import { MastoAccount } from '../_interface.js';

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
