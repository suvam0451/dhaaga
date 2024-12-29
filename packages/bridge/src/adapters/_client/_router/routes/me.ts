import { LibraryPromise } from './_types.js';
import { Endpoints } from 'misskey-js';
import { AppBskyActorGetProfile } from '@atproto/api';
import { MastoAccountCredentials } from '../../../../types/mastojs.types.js';

export interface MeRoute {
	/**
	 * my user object
	 */
	getMe(): LibraryPromise<
		| MastoAccountCredentials
		| Endpoints['i']['res']
		| AppBskyActorGetProfile.Response
	>;
}
