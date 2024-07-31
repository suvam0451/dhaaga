import {
	MastoContext,
	MastoRelationship,
	MastoStatus,
	MissContext,
	MissNote,
} from '../../_interface.js';
import { LibraryPromise } from './_types.js';
import { Endpoints } from 'misskey-js';

export interface StatusesRoute {
	get(id: string): LibraryPromise<MastoStatus | MissNote>;

	bookmark(
		id: string,
	): LibraryPromise<MastoStatus | Endpoints['notes/favorites/create']['res']>;

	unBookmark(
		id: string,
	): LibraryPromise<MastoStatus | Endpoints['notes/favorites/delete']['res']>;

	getContext(
		id: string,
		limit?: number,
	): LibraryPromise<MastoContext | MissContext>;
}
