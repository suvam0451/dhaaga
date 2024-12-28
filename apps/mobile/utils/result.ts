export type Result<T> =
	| { type: 'success'; value?: T }
	| { type: 'error'; error: Error }
	| {
			type: 'duplicate';
			value: T;
	  }
	| {
			type: 'invalid';
	  }
	| {
			type: 'not-found';
	  };

export type AsyncResult<T> = Promise<Result<T>>;

export function withSuccess<T>(input: T): Result<T> {
	return { type: 'success', value: input } as Result<T>;
}
