import { DhaagaErrorCode, LibraryResponse } from '../_client/_router/_types.js';
import camelcaseKeys from 'camelcase-keys';
import { extractPaginationFromLinkHeader } from '../_client/_router/utils/link-header.js';
import * as snakecaseKeys from 'snakecase-keys';

class AppApi {
	baseUrl: string;
	token?: string;

	constructor(urlLike: string, token?: string) {
		this.baseUrl = this.cleanLink(urlLike);
		this.token = token;
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
		console.log(obj, typeof obj, snakecaseKeys.default(obj));
		return snakecaseKeys.default(obj) as Record<string, any>;
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
		console.log('processing changes');
		endpoint = query
			? `${this.baseUrl}${endpoint}?` +
				new URLSearchParams(this.cleanObject(query))
			: `${this.baseUrl}${endpoint}?`;
		console.log(endpoint, this.token);
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
			// signal: AbortSignal.timeout(5000),
		})
			.then(async (response) => {
				console.log(response);
				if (!response.ok) {
					throw new Error(
						JSON.stringify({
							status: response.status,
							statusText: response.statusText,
						}),
					);
				}
				console.log('done !!!');
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
				console.log(response.headers);
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
