import { MeRoute } from './_interface.js';
import { Endpoints } from 'misskey-js';
import { MastoAccountCredentials } from '#/types/mastojs.types.js';

export class DefaultMeRouter implements MeRoute {
	async getMe(): Promise<MastoAccountCredentials | Endpoints['i']['res']> {
		throw new Error('Method not implemented.');
	}
}
