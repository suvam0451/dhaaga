import { LibraryPromise } from './_types.js';

export interface ListsRoute {
	update(): LibraryPromise<any>;

	get(id: string): LibraryPromise<any>;
}
