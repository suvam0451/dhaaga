import { errorBuilder, successWithData } from './dto/api-responses.dto.js';
import { ApiErrorCode, LibraryResponse } from '../../../types/result.types.js';

async function CommonErrorHandler(e: any) {
	if (e?.response?.data?.error?.code) {
		const code = e?.response?.data?.error?.code;
		return {
			statusCode: e?.response?.status,
			error: {
				code,
				message: code,
			},
		};
	} else if (e?.code) {
		return {
			error: {
				code: e.code,
				message: e.code,
			},
		};
	} else {
		console.log('[WARN]: new error', e);
		return {
			error: {
				code: ApiErrorCode.UNKNOWN_ERROR,
				message: e,
			},
		};
	}
}

// Define a generic function that takes another function as input
export async function MastoErrorHandler<T extends (...args: any[]) => any>(
	func: T,
	args?: Parameters<T>,
): Promise<LibraryResponse<ReturnType<T>>> {
	try {
		return {
			data: args ? await func(...args) : await func(),
		};
	} catch (e) {
		return CommonErrorHandler(e);
	}
}

/**
 * Why did you use these paginator stuff?
 * Whyyyyyyyyy? Just keep it simple, smh
 */
export async function MastojsHandler<T>({
	data,
	error,
}: LibraryResponse<Promise<T>>): Promise<LibraryResponse<T>> {
	try {
		const resData = await data;
		if (error || resData === undefined) {
			return errorBuilder(error);
		}
		return successWithData(data);
	} catch (e) {
		console.log(e);
		return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
	}
}

export async function PleromaErrorHandler<T extends (...args: any[]) => any>(
	foo: ThisParameterType<T>,
	func: T,
): Promise<LibraryResponse<ReturnType<T>>> {
	try {
		return {
			data: await func.bind(foo).apply(foo),
		};
	} catch (e) {
		return CommonErrorHandler(e);
	}
}
