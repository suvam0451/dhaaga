import camelcaseKeys from 'camelcase-keys';
import * as snakecaseKeys from 'snakecase-keys';
import { DhaagaErrorCode, LibraryResponse } from '../types/result.types.js';

/**
 * Use Fetch API to
 * make requests ourselves
 *
 * Use this when the library
 * does not support the required
 * functionality
 */
class FetchWrapper {
	baseUrl: string;
	token?: string;
	requestHeader: HeadersInit;

	constructor(urlLike: string, token?: string) {
		this.baseUrl = DhaagaApiUtils.ensureHttpsAppend(urlLike);
		this.token = token;
		this.requestHeader = this.token
			? {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.token}`,
				}
			: {
					'Content-Type': 'application/json',
				};
		return this;
	}

	static create(urlLike: string, token?: string) {
		return new FetchWrapper(urlLike, token);
	}

	private cleanObject(obj: any) {
		Object.keys(obj).forEach((key) => {
			if (obj[key] === null || obj[key] === undefined) {
				delete obj[key];
			}
		});

		// You do me dirty, ruby gang :)
		let typesOverride = obj['types[]'];
		const retval = snakecaseKeys.default(obj) as Record<string, any>;
		if (typesOverride) {
			delete retval['types'];
			retval['types[]'] = typesOverride;
		}

		return retval;
	}

	private withQuery(endpoint: string, query?: any) {
		if (!query) return `${this.baseUrl}${endpoint}`;

		// smh... ruby backend can't even deal with arrays...
		if (query['types[]'] !== undefined) {
			const sample = this.cleanObject(query);
			const items = sample['types[]'].split(';');
			delete sample['query[]'];

			const params = new URLSearchParams(this.cleanObject(sample));
			for (const item of items) {
				params.append('types[]', item);
			}
			console.log(`${this.baseUrl}${endpoint}?` + params.toString());
			return `${this.baseUrl}${endpoint}?` + params.toString();
		}

		return (
			`${this.baseUrl}${endpoint}?` +
			new URLSearchParams(this.cleanObject(query))
		);
	}

	async getCamelCaseWithLinkPagination<T>(
		endpoint: string,
		query?: Object | Record<string, string>,
	): Promise<
		LibraryResponse<{
			data: T;
			minId?: string | null;
			maxId?: string | null;
		}>
	> {
		endpoint = this.withQuery(endpoint, query);
		return await fetch(endpoint, {
			method: 'GET',
			headers: this.requestHeader,
		})
			.then(async (response) => {
				if (!response.ok) {
					throw new Error(
						JSON.stringify({
							status: response.status,
							statusText: response.statusText,
						}),
					);
				}
				const { minId, maxId } = DhaagaApiUtils.extractPaginationFromLinkHeader(
					response.headers,
				);
				const _data = camelcaseKeys(await response.json(), { deep: true });
				return {
					data: {
						data: _data,
						minId,
						maxId,
					},
				};
			})
			.catch((e) => {
				console.log(e);
				return {
					error: {
						code: DhaagaErrorCode.UNKNOWN_ERROR,
						message: e,
					},
				};
			});
	}

	async getCamelCase<T>(
		endpoint: string,
		query?: Object | Record<string, string>,
	): Promise<LibraryResponse<T>> {
		endpoint = this.withQuery(endpoint, query);
		return await fetch(endpoint, {
			method: 'GET',
			headers: this.requestHeader,
		})
			.then(async (response) => {
				if (!response.ok) {
					throw new Error(
						JSON.stringify({
							status: response.status,
							statusText: response.statusText,
						}),
					);
				}
				DhaagaApiUtils.extractPaginationFromLinkHeader(response.headers);
				const data = camelcaseKeys(await response.json(), { deep: true });
				return { data };
			})
			.catch((e) => {
				return {
					error: {
						code: DhaagaErrorCode.UNKNOWN_ERROR,
						message: e,
					},
				};
			});
	}

	async post<T>(
		endpoint: string,
		body: object,
		opts: {},
	): Promise<LibraryResponse<T>> {
		endpoint = `${this.baseUrl}${endpoint}`;
		return await fetch(endpoint, {
			method: 'POST',
			headers: this.token
				? {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${this.token}`,
					}
				: {
						'Content-Type': 'application/json',
					},
			body: JSON.stringify(body),
		})
			.then(async (response) => {
				if (!response.ok) {
					throw new Error(
						JSON.stringify({
							status: response.status,
							statusText: response.statusText,
						}),
					);
				}
				return { data: await response.json() };
			})
			.catch((e) => {
				return {
					error: {
						code: DhaagaErrorCode.UNKNOWN_ERROR,
						message: e,
					},
				};
			});
	}

	async get<T>(
		endpoint: string,
		query?: Object | Record<string, string>,
	): Promise<LibraryResponse<T>> {
		endpoint = query
			? `${this.baseUrl}${endpoint}?` +
				new URLSearchParams(this.cleanObject(query))
			: `${this.baseUrl}${endpoint}?`;

		console.log(endpoint, query);
		return await fetch(endpoint, {
			method: 'GET',
			headers: this.token
				? {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${this.token}`,
					}
				: {
						'Content-Type': 'application/json',
					},
		})
			.then(async (response) => {
				if (!response.ok) {
					throw new Error(
						JSON.stringify({
							status: response.status,
							statusText: response.statusText,
						}),
					);
				}
				return { data: await response.json() };
			})
			.catch((e) => {
				return {
					error: {
						code: DhaagaErrorCode.UNKNOWN_ERROR,
						message: e,
					},
				};
			});
	}
}

class DhaagaApiUtils {
	/**
	 * Since http(s) is not appended to server names
	 * in our dhaaga app databases, we want the flexibility
	 * of not having to worry about appending it
	 * everywhere
	 */
	static ensureHttpsAppend(urlLike: string) {
		if (urlLike.startsWith('http://') || urlLike.startsWith('https://')) {
		} else {
			urlLike = 'https://' + urlLike;
		}
		return urlLike.replace(/\/+$/, '');
	}

	/**
	 * Mastodon sometimes embeds the
	 * pagination tokens in Link header
	 *
	 * This function extracts the minId, maxId
	 * or returns null
	 * @param headers
	 */
	static extractPaginationFromLinkHeader(headers: any): {
		minId?: string | null;
		maxId?: string | null;
	} {
		const linkHeader = headers?.map?.link;
		const maxIdRegex = /max_id=([0-9]+)/;
		const minIdRegex = /min_id=([0-9]+)/;

		let maxId = null;
		let minId = null;
		if (minIdRegex.test(linkHeader)) {
			const minMatch = linkHeader.match(minIdRegex);
			minId = minMatch[1];
		}
		if (maxIdRegex.test(linkHeader)) {
			const maxMatch = linkHeader.match(maxIdRegex);
			maxId = maxMatch[1];
		}

		return { minId, maxId };
	}
}

export default FetchWrapper;
