import { ApiErrorCode, LibraryResponse } from '#/types/result.types.js';

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
