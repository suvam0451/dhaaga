import { MeRoute } from '../_router/routes/me.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { MastoAccountCredentials } from '../_interface.js';
import { Endpoints } from 'misskey-js';

export class BlueskyMeRouter implements MeRoute {
	getMe(): LibraryPromise<MastoAccountCredentials | Endpoints['i']['res']> {
		return Promise.resolve(undefined) as any;
	}
}
