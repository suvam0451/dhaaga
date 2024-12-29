import { LibraryResponse } from '../../../../types/result.types.js';

export type PaginatedLibraryPromise<T> = Promise<
	LibraryResponse<{
		data: T;
		minId?: string | null;
		maxId?: string | null;
	}>
>;

export type LibraryPromise<T> = Promise<LibraryResponse<T>>;
