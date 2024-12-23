export type ApiErrorComponent = {
	code: string;
	message?: any;
};

export enum DhaagaErrorCode {
	UNAUTHORIZED = 'E_UNAUTHORIZED',
	INSTANCE_SOFTWARE_DETECTION_FAILED = 'INSTANCE_SOFTWARE_DETECTION_FAILED',
	DEFAULT_CLIENT = 'E_DEFAULT_CLIENT',
	FEATURE_UNSUPPORTED = 'E_FEATURE_UNSUPPORTED',
	UNKNOWN_ERROR = 'E_UNKNOWN_ERROR',
	OPERATION_UNSUPPORTED = 'E_OPERATION_UNSUPPORTED',
}

type LibraryResponseBase = {
	statusCode?: number /**
	 * The raw API response received from the server
	 *
	 * Useful in cases where Dhaaga transforms and
	 * standardises data, while you may need additional
	 * properties
	 */;
	raw?: any;
};
export type LibraryResponse<T> =
	| ({ error: ApiErrorComponent; data?: undefined } & LibraryResponseBase)
	| ({
			error?: undefined;
			data: T;
	  } & LibraryResponseBase);
