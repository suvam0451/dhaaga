import { LibraryResponse } from '#/types/result.types.js';

export type PaginatedPromise<T> = Promise<{
	data: T;
	minId?: string | null;
	maxId?: string | null;
}>;

export type LibraryPromise<T> = Promise<LibraryResponse<T>>;
