/**
 * Extended monadic error handling
 * for the Dhaaga codebase
 */

import { DhaagaErrorCode } from '../types/result.types.js';
import { Result } from './result.js';

type ApiResult<T> = Result<T, DhaagaErrorCode>;
type ApiAsyncResult<T> = Promise<Result<T, DhaagaErrorCode>>;

export type { ApiResult, ApiAsyncResult };
