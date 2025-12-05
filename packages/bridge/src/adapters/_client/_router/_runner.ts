import { LibraryResponse } from '#/types/result.types.js';
import { getHumanReadableError } from '#/utils/errors.utils.js';

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
		getHumanReadableError(e);
		return { error: { code: 'UNKNOWN_ERROR' } };
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
		getHumanReadableError(e);
		return { error: { code: 'UNKNOWN_ERROR' } };
	}
}
