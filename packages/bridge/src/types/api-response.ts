import { ApiErrorCode, LibraryResponse } from '#/types/result.types.js';

type ResultPage<T> = {
	items: T[];
	maxId?: string | null;
	minId?: string | null;
	error?: Error;
};

const defaultResultPage = {
	items: [],
	maxId: null,
	minId: null,
};

export type { ResultPage };
export { defaultResultPage };

export function errorBuilder<T>(error?: any): LibraryResponse<T> {
	return {
		error: {
			code: error?.code || ApiErrorCode.UNKNOWN_ERROR,
		},
	};
}

export function notImplementedErrorBuilder<T>(): LibraryResponse<T> {
	return {
		error: {
			code: ApiErrorCode.UNKNOWN_ERROR,
		},
	};
}

export type PaginatedPromise<T> = Promise<{
	data: T;
	minId?: string | null;
	maxId?: string | null;
}>;
export type LibraryPromise<T> = Promise<LibraryResponse<T>>;
