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
import { mastodon, createRestAPIClient } from 'masto';
import generator, { MegalodonInterface } from 'megalodon';
import { KNOWN_SOFTWARE } from './driver.js';
import { api } from 'misskey-js';

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
