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

export enum ApiErrorCode {
	UNAUTHORIZED = 'E_UNAUTHORIZED',
	INCOMPATIBLE_DRIVER = 'E_INCOMPATIBLE_DRIVER',
	INSTANCE_SOFTWARE_DETECTION_FAILED = 'INSTANCE_SOFTWARE_DETECTION_FAILED',
	DEFAULT_CLIENT = 'E_DEFAULT_CLIENT',
	FEATURE_UNSUPPORTED = 'E_FEATURE_UNSUPPORTED',
	UNKNOWN_ERROR = 'E_UNKNOWN_ERROR',
	OPERATION_UNSUPPORTED = 'E_OPERATION_UNSUPPORTED',
	REMOTE_SERVER_ERROR = 'E_REMOTE_SERVER_ERROR',
	INVALID_INPUT = 'E_INVALID_INPUT',

	// Parser
	PARSING_FAILED = 'E_PARSING_FAILED',
}

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
