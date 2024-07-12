import { LibraryResponse } from '../_types.js';
import {
	GetTrendingPostsQueryDTO,
	MastoStatus,
	MastoTag,
	MastoTrendLink,
} from '../../_interface.js';

export interface TrendsRoute {
	tags(): Promise<LibraryResponse<MastoTag[]>>;

	posts(
		opts: GetTrendingPostsQueryDTO,
	): Promise<LibraryResponse<MastoStatus[]>>;

	links(): Promise<LibraryResponse<MastoTrendLink[]>>;
}
