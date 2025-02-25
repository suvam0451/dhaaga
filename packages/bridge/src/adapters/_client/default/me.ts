import { MeRoute } from '../_router/routes/me.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { Endpoints } from 'misskey-js';
import { MastoAccountCredentials } from '../../../types/mastojs.types.js';

export class DefaultMeRouter implements MeRoute {
	async getMe(): LibraryPromise<
		MastoAccountCredentials | Endpoints['i']['res']
	> {
		return notImplementedErrorBuilder();
	}
}
