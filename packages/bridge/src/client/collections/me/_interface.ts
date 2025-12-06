import { Endpoints } from 'misskey-js';
import { AppBskyActorGetProfile } from '@atproto/api';
import { MastoAccountCredentials } from '#/types/mastojs.types.js';

export interface MeRoute {
	/**
	 * my user object
	 */
	getMe(): Promise<
		| MastoAccountCredentials
		| Endpoints['i']['res']
		| AppBskyActorGetProfile.Response
	>;
}
