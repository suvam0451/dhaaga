import { MastoAccount } from '#/types/mastojs.types.js';
import { LibraryPromise } from '#/types/index.js';

export interface ProfileRoute {
	followRequests(): LibraryPromise<MastoAccount>;
}
