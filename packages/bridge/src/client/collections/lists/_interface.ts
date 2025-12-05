import { LibraryPromise } from '../../../adapters/_client/_router/routes/_types.js';
import { Endpoints } from 'misskey-js';
import { MastoList } from '#/types/mastojs.types.js';
import { MegaList } from '#/types/megalodon.types.js';

export interface ListsRoute {
	update(): Promise<any>;

	get(id: string): Promise<MegaList | MastoList>;

	list(): Promise<
		MegaList[] | MastoList[] | Endpoints['users/lists/list']['res']
	>;
}
