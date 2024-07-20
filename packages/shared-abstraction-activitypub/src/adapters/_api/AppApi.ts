import { DhaagaErrorCode, LibraryResponse } from '../_client/_router/_types.js';
import camelcaseKeys from 'camelcase-keys';
import { extractPaginationFromLinkHeader } from '../_client/_router/utils/link-header.js';
import * as snakecaseKeys from 'snakecase-keys';

/**
 * Use Fetch API to
 * make requests ourselves
 *
 * Use this when the library
 * does not support the required
 * functionality
 */
class AppApi {
	baseUrl: string;
	token?: string;
	requestHeader: HeadersInit;

	constructor(urlLike: string, token?: string) {
		this.baseUrl = this.cleanLink(urlLike);
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

	private cleanLink(urlLike: string) {
		if (urlLike.startsWith('http://') || urlLike.startsWith('https://')) {
		} else {
			urlLike = 'https://' + urlLike;
		}
		return urlLike.replace(/\/+$/, '');
	}

	private cleanObject(obj: any) {
		Object.keys(obj).forEach((key) => {
			if (obj[key] === null) {
				delete obj[key];
			}
		});
		return snakecaseKeys.default(obj) as Record<string, any>;
	}

	private withQuery(endpoint: string, query?: any) {
		return query
			? `${this.baseUrl}${endpoint}?` +
					new URLSearchParams(this.cleanObject(query))
			: `${this.baseUrl}${endpoint}?`;
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
				const { minId, maxId } = extractPaginationFromLinkHeader(
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
				extractPaginationFromLinkHeader(response.headers);
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

	async get<T>(
		endpoint: string,
		query?: Object | Record<string, string>,
	): Promise<LibraryResponse<T>> {
		endpoint = query
			? `${this.baseUrl}${endpoint}?` +
				new URLSearchParams(this.cleanObject(query))
			: `${this.baseUrl}${endpoint}?`;
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

export default AppApi;
