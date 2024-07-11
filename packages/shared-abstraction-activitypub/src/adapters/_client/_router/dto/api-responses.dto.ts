import { DhaagaErrorCode, LibraryResponse } from '../_types.js';

export function successWithData(data: any) {
	return {
		data,
	};
}

export function errorBuilder(error?: any) {
	return {
		error: {
			code: error?.code || DhaagaErrorCode.UNKNOWN_ERROR,
		},
	};
}

export function notImplementedErrorBuilder(): LibraryResponse<any> {
	return {
		error: {
			code: DhaagaErrorCode.UNKNOWN_ERROR,
		},
	};
}
