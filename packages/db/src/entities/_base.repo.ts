import { DbErrorCode, type DbResult, Err } from '../utils/db-result.js';

export abstract class RepoTemplate<T> {
	static describe() {}
	static list<T>(): DbResult<T[]> {
		return Err(DbErrorCode.NOT_IMPLEMENTED);
	}
}

function TryCatchDecorator(
	target: any,
	propertyKey: string,
	descriptor: PropertyDescriptor,
) {
	const originalMethod = descriptor.value;

	descriptor.value = async function (...args: any[]) {
		try {
			return await originalMethod.apply(this, args);
		} catch (error) {
			console.error(`Error in method ${propertyKey}:`, error);
			// Handle the error as needed
			throw error; // Optionally rethrow the error if needed
		}
	};

	return descriptor;
}

/**
 * apply this to repository classes
 * @constructor
 */
export function DbErrorHandler(): ClassDecorator {
	return (constructor: Function) => {
		const methodNames = Object.getOwnPropertyNames(
			constructor.prototype,
		).filter(
			(key) =>
				key !== 'constructor' &&
				typeof constructor.prototype[key] === 'function',
		);

		for (const methodName of methodNames) {
			const descriptor = Object.getOwnPropertyDescriptor(
				constructor.prototype,
				methodName,
			);
			if (descriptor) {
				Object.defineProperty(
					constructor.prototype,
					methodName,
					TryCatchDecorator(constructor.prototype, methodName, descriptor),
				);
			}
		}
	};
}
