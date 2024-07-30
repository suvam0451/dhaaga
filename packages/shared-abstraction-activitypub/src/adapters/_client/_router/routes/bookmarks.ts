import { MastoStatus, MegaStatus } from '../../_interface.js';
import { LibraryResponse } from '../_types.js';
import { Endpoints } from 'misskey-js';

export type BookmarkGetQueryDTO = {
	limit: number;
	maxId?: string;
	minId?: string;
};

export interface BookmarksRoute {
	get(query: BookmarkGetQueryDTO): Promise<
		LibraryResponse<{
			data: MastoStatus[] | MegaStatus[] | Endpoints['i/favorites']['res'];
			minId?: string | null;
			maxId?: string | null;
		}>
	>;
}
