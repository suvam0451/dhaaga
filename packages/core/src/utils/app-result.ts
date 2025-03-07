import { type Result, ResultErr, ResultOk } from '@dhaaga/bridge';

enum AppErrorCode {
	UNKNOWN = 'E_UNKNOWN_ERROR',
	PARSING_ERROR = 'E_PARSING_ERROR',
}

type AppResult<T> = Result<T, AppErrorCode>;
type AppAsyncResult<T> = Promise<Result<T, AppErrorCode>>;

function Ok<T>(value: T): Result<T, AppErrorCode> {
	return ResultOk<T, AppErrorCode>(value);
}

function Err<T>(error: AppErrorCode): Result<T, AppErrorCode> {
	return ResultErr<T, AppErrorCode>(error);
}

export { AppErrorCode, Ok, Err };
export type { AppResult, AppAsyncResult };
