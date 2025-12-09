import { ProfileRoute } from './_interface.js';
import { MastoAccount } from '#/types/mastojs.types.js';

export class DefaultProfileRouter implements ProfileRoute {
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
