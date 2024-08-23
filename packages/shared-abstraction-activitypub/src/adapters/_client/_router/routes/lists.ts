import { LibraryPromise } from './_types.js';
import { MastoList, MegaList } from '../../_interface.js';
import { Endpoints } from 'misskey-js';

export interface ListsRoute {
	update(): LibraryPromise<any>;

	get(id: string): LibraryPromise<MegaList | MastoList>;

	list(): LibraryPromise<
		MegaList[] | MastoList[] | Endpoints['users/lists/list']['res']
	>;
}
