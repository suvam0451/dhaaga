import { type Result, ResultErr, ResultOk } from '@dhaaga/bridge';

enum DbErrorCode {
	UNKNOWN = 'E_UNKNOWN_ERROR',
	NOT_FOUND = 'E_NOT_FOUND',
	DUPLICATE = 'E_DUPLICATE',
	WRITE_FAILED = 'E_WRITE_FAILED',
	NOT_IMPLEMENTED = 'E_NOT_IMPLEMENTED',
}

type DbResult<T> = Result<T, DbErrorCode>;
type DbAsyncResult<T> = Promise<Result<T, DbErrorCode>>;

function Ok<T>(value: T): Result<T, DbErrorCode> {
	return ResultOk<T, DbErrorCode>(value);
}

function Err<T>(error: DbErrorCode): Result<T, DbErrorCode> {
	return ResultErr<T, DbErrorCode>(error);
}

export { DbErrorCode, Ok, Err };
export type { DbResult, DbAsyncResult };
