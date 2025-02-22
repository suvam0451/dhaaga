/**
 * Extended monadic error handling
 * for the Dhaaga codebase
 */

import { ApiErrorCode } from '../types/result.types.js';
import { Result } from './result.js';

type ApiResult<T> = Result<T, ApiErrorCode>;
type ApiAsyncResult<T> = Promise<Result<T, ApiErrorCode>>;

export type { ApiResult, ApiAsyncResult };
