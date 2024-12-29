import { LibraryPromise } from './_types.js';
import { MastoAccount } from '../../../../types/mastojs.types.js';

export interface ProfileRoute {
	followRequests(): LibraryPromise<MastoAccount>;
}
