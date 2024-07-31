import { MastoAccountCredentials } from '../../_interface.js';
import { LibraryPromise } from './_types.js';
import { Endpoints } from 'misskey-js';

export interface MeRoute {
	/**
	 * my user object
	 */
	getMe(): LibraryPromise<MastoAccountCredentials | Endpoints['i']['res']>;
}
