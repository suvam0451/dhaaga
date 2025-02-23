/**
 * Light-Weight Monadic error handling
 * Implementation for Typescript
 */

import { ApiErrorCode } from '../types/result.types.js';

/**
 * Classes
 */

class OkClass<T, E> {
	constructor(public value: T) {}

	isOk(): this is OkClass<T, E> {
		return true;
	}

	isErr(): this is ErrClass<T, E> {
		return false;
	}

	map<U>(fn: (value: T) => U): Result<U, E> {
		return new OkClass<U, E>(fn(this.value));
	}

	flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
		return fn(this.value);
	}

	fold<B>(onOk: (value: T) => B, onErr: (error: E) => B): B {
		return onOk(this.value);
	}

	toPromise(): Promise<T> {
		return Promise.resolve(this.value);
	}

	filter(predicate: (value: T) => boolean, error: E): Result<T, E> {
		return predicate(this.value) ? this : new ErrClass(error);
	}

	unwrap(): T {
		return this.value;
	}

	unwrapOrElse(defaultValue: T): T {
		return this.value;
	}

	unwrapOr(fallback: T): T {
		return this.value;
	}

	tap(fn: (value: T) => void): Result<T, E> {
		if (this.isOk()) {
			fn(this.value);
		}
		return this;
	}

	tapError(fn: (error: E) => void): Result<T, E> {
		return this;
	}
}

class ErrClass<T, E> {
	constructor(public error: E) {}

	isOk(): this is OkClass<T, E> {
		return false;
	}

	isErr(): this is ErrClass<T, E> {
		return true;
	}

	map<U>(fn: (value: T) => U): Result<U, E> {
		return this as unknown as ErrClass<U, E>;
	}

	flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
		return this as any;
	}

	fold<B>(onOk: (value: T) => B, onErr: (error: E) => B): B {
		return onErr(this.error);
	}

	toPromise(): Promise<T> {
		return Promise.reject(this.error);
	}

	filter(predicate: (value: T) => boolean, error: E): Result<T, E> {
		return this;
	}

	unwrap(): never {
		throw new Error(
			`Attempted to unwrap an Err: ${JSON.stringify(this.error)}`,
		);
	}

	unwrapOrElse(defaultValue: T): T {
		return defaultValue;
	}

	unwrapOr(fallback: never): never {
		return fallback;
	}

	tap(fn: (value: T) => void): Result<T, E> {
		return this;
	}

	tapError(fn: (error: E) => void): Result<T, E> {
		if (this.isErr()) {
			fn(this.error);
		}
		return this;
	}
}

/**
 * Typings
 */

type Result<T, E> = OkClass<T, E> | ErrClass<T, E>;
type AsyncResult<T, E> = Promise<Result<T, E>>;

/**
 * Utility
 */

function ResultOk<T, E>(value: T): Result<T, E> {
	return new OkClass(value);
}

function ResultErr<T, E>(error: E): Result<T, E> {
	return new ErrClass(error);
}

function Ok<T>(value: T): Result<T, string> {
	return new OkClass(value);
}

function Err<T>(error: string): Result<T, string> {
	return new ErrClass(error);
}

export { ResultOk, ResultErr, Ok, Err };
export type { Result, AsyncResult };
