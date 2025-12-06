/**
 * Utility classes to instantiate the
 * API clients for each corresponding
 * library
 *
 * In cases where a certain endpoint
 * is not/partially supported by the
 * client libraries, the "direct"
 * object can be used to make raw
 * API calls using fetch
 */

import FetchWrapper from './fetch.js';
import { createRestAPIClient, mastodon } from 'masto';
import generator, { MegalodonInterface } from 'megalodon';
import { KNOWN_SOFTWARE } from './driver.js';
import { api } from 'misskey-js';
import { LibraryResponse } from '#/types/result.types.js';
import { getHumanReadableError } from '#/utils/errors.utils.js';

/**
 * Used for --> Mastodon
 */
export class MastoJsWrapper extends FetchWrapper {
	lib: mastodon.rest.Client;

	constructor(baseUrl: string, token?: string) {
		super(baseUrl, token);

		this.lib = createRestAPIClient({
			url: this.baseUrl,
			accessToken: this.token || undefined,
		});
	}

	static create(baseUrl: string, token?: string) {
		return new MastoJsWrapper(baseUrl, token);
	}
}

/**
 * Used for --> Pleroma, Akkoma
 */
export class MegalodonPleromaWrapper extends FetchWrapper {
	client: MegalodonInterface;

	constructor(baseUrl: string, token?: string) {
		super(baseUrl, token);

		// @ts-ignore-next-line
		this.client = generator(
			KNOWN_SOFTWARE.PLEROMA,
			this.baseUrl,
			this.token || undefined,
		);
	}

	static create(baseUrl: string, token?: string) {
		return new MegalodonPleromaWrapper(baseUrl, token);
	}
}

/**
 * Used for --> GoToSocial (public requests only)
 */
export class MegalodonGoToSocialWrapper extends FetchWrapper {
	client: MegalodonInterface;

	constructor(baseUrl: string, token?: string) {
		super(baseUrl, token);

		// @ts-ignore-next-line
		this.client = generator(
			KNOWN_SOFTWARE.GOTOSOCIAL,
			this.baseUrl,
			this.token || undefined,
		);
	}

	static create(baseUrl: string, token?: string) {
		return new MegalodonGoToSocialWrapper(baseUrl, token);
	}
}

/**
 * Used for --> Misskey, Sharkey, Firefish
 */
export class MisskeyJsWrapper extends FetchWrapper {
	client: api.APIClient;

	constructor(baseUrl: string, token?: string) {
		super(baseUrl, token);

		this.client = new api.APIClient({
			origin: this.baseUrl,
			credential: this.token || undefined,
		});
	}

	static create(baseUrl: string, token?: string) {
		return new MisskeyJsWrapper(baseUrl, token);
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
