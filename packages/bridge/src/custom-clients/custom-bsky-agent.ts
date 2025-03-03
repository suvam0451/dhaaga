import { errorBuilder } from '../adapters/_client/_router/dto/api-responses.dto.js';
import { ApiErrorCode } from '../types/result.types.js';
import { LibraryPromise } from '../adapters/_client/_router/routes/_types.js';
import { ApiAsyncResult } from '../utils/api-result.js';
import { Err, Ok } from '../utils/index.js';

/**
 * Call a bsky function and handle errors
 * @param name friendly name for the function
 * @param fn
 * @param agent agent to bind to
 * @param params optional params, if applicable
 * @param headers for proxying
 */
export async function InvokeBskyFunction<T>(
	name: string,
	fn: Function,
	agent: any,
	params: Object,
	headers?: Object,
): LibraryPromise<T> {
	try {
		const data = params
			? headers
				? await fn.call(agent, params, headers)
				: await fn.call(agent, params)
			: headers
				? fn.call(agent, headers)
				: fn.call(agent);
		if (!data.success) {
			console.log('[WARN]: atproto agent returned failure', name);
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		}
		return { data: data.data };
	} catch (e) {
		console.log('[WARN]: atproto agent failed request', name, e);
		return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
	}
}

export async function InvokeBskyFunction_Improved<T>(
	name: string,
	fn: Function,
	agent: any,
	params: Object,
	headers?: Object,
): ApiAsyncResult<T> {
	try {
		const data = params
			? headers
				? await fn.call(agent, params, headers)
				: await fn.call(agent, params)
			: headers
				? fn.call(agent, headers)
				: fn.call(agent);
		if (!data.success) {
			console.log('[WARN]: atproto agent returned failure', name);
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		}
		return Ok(data.data);
	} catch (e) {
		console.log('[WARN]: atproto agent failed request', name, e);
		return Err(ApiErrorCode.UNKNOWN_ERROR);
	}
}
