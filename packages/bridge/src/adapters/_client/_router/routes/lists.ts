import { LibraryPromise } from './_types.js';
import { Endpoints } from 'misskey-js';
import { MastoList } from '#/types/mastojs.types.js';
import { MegaList } from '#/types/megalodon.types.js';

export interface ListsRoute {
	update(): LibraryPromise<any>;

	get(id: string): LibraryPromise<MegaList | MastoList>;

	list(): LibraryPromise<
		MegaList[] | MastoList[] | Endpoints['users/lists/list']['res']
	>;
}
