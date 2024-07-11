import { MastoStatus, MegaStatus } from '../../_interface.js';
import { LibraryResponse } from '../_types.js';

export type BookmarkGetQueryDTO = {
	limit: number;
	maxId?: string;
	minId?: string;
};

export interface BookmarksRoute {
	get(query: BookmarkGetQueryDTO): Promise<
		LibraryResponse<{
			data: MastoStatus[] | MegaStatus[];
			minId?: string | null;
			maxId?: string | null;
		}>
	>;
}
