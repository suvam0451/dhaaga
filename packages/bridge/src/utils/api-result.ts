/**
 * Extended monadic error handling
 * for the Dhaaga codebase
 */

import { Result } from './result.js';

type ApiResult<T> = Result<T, string>;
type ApiAsyncResult<T> = Promise<Result<T, string>>;

export type { ApiResult, ApiAsyncResult };
