import { MastoAccount } from '#/types/mastojs.types.js';

export interface ProfileRoute {
	followRequests(): Promise<MastoAccount>;
}
