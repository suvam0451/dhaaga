import { ApiErrorCode } from '#/types/result.types.js';

type ResultPage<T> = {
	data: T;
	maxId?: string | null;
	minId?: string | null;
	hitsTotal?: number;
};

const defaultResultPage = {
	data: [],
	maxId: null,
	minId: null,
	hitsTotal: 0,
};

export type { ResultPage };
export { defaultResultPage };

export function errorBuilder<T>(error?: any): any {
	return {
		error: {
			code: error?.code || ApiErrorCode.UNKNOWN_ERROR,
		},
	};
}

export function notImplementedErrorBuilder<T>(): any {
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
	hitsTotal?: number;
}>;
