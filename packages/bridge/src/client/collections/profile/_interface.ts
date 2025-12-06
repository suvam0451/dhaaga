import { LibraryPromise } from '#/adapters/_client/_router/routes/_types.js';
import { MastoAccount } from '#/types/mastojs.types.js';

export interface ProfileRoute {
	followRequests(): LibraryPromise<MastoAccount>;
}
