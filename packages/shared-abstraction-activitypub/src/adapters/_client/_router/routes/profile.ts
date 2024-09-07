import { MastoAccount } from '../../_interface.js';
import { LibraryPromise } from './_types.js';

export interface ProfileRoute {
	followRequests(): LibraryPromise<MastoAccount>;
}
