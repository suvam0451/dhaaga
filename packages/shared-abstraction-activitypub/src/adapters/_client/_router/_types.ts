export type ApiErrorComponent = {
	code: string;
	message?: any;
};

export enum DhaagaErrorCode {
	DEFAULT_CLIENT = 'E_DEFAULT_CLIENT',
	SOFTWARE_UNSUPPORTED_BY_LIBRARY = 'E_FEATURE_UNSUPPORTED',
	UNKNOWN_ERROR = 'E_UNKNOWN_ERROR',
}

export type LibraryResponse<T> = {
	data?: T;
	error?: ApiErrorComponent;
};
