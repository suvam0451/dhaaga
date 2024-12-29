import {
	DhaagaErrorCode,
	LibraryResponse,
} from '../../../../types/result.types.js';

export function successWithData(data: any) {
	return {
		data,
	};
}

export function errorBuilder<T>(error?: any): LibraryResponse<T> {
	return {
		error: {
			code: error?.code || DhaagaErrorCode.UNKNOWN_ERROR,
		},
	};
}

export function notImplementedErrorBuilder<T>(): LibraryResponse<T> {
	return {
		error: {
			code: DhaagaErrorCode.UNKNOWN_ERROR,
		},
	};
}
