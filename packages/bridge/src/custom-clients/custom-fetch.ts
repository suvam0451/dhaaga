import { ApiErrorCode, LibraryResponse } from '../types/result.types.js';
import { CasingUtil } from '../utils/casing.js';
import { BaseUrlNormalizationService } from '../utils/urls.js';

type DhaagaFetchRequestConfig = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH';
	baseURL?: string;
	accessToken?: string;
	queries?: Object | Record<string, string>;
	transformQueryKeys?: 'snake' | 'camel';
	transformQueryValues?: 'snake' | 'camel';
	transformResponse?: 'snake' | 'camel';
};

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
		this.baseUrl = BaseUrlNormalizationService.appendHttps(urlLike);
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

	/**
	 * 1) Removes null/undefined keys.
	 * 2) Adjusts for RoR backends.
	 *
	 * which treats types[]=a&types[]=b as an array ["a", "b"].
	 * @param obj
	 * @private
	 */
	private static cleanObject(obj: any) {
		Object.keys(obj).forEach((key) => {
			if (obj[key] === null || obj[key] === undefined) {
				delete obj[key];
			}
		});

		// You do me dirty, ruby gang :)
		let typesOverride = obj['types[]'];
		const retval = CasingUtil.snakeCaseKeys(obj) as Record<string, any>;
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
			const sample = FetchWrapper.cleanObject(query);
			const items = sample['types[]'].split(';');
			delete sample['query[]'];

			const params = new URLSearchParams(FetchWrapper.cleanObject(sample));
			for (const item of items) {
				params.append('types[]', item);
			}
			console.log(`${this.baseUrl}${endpoint}?` + params.toString());
			return `${this.baseUrl}${endpoint}?` + params.toString();
		}

		return (
			`${this.baseUrl}${endpoint}?` +
			new URLSearchParams(FetchWrapper.cleanObject(query))
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
				const _data = CasingUtil.camelCaseKeys(await response.json());
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
						code: ApiErrorCode.UNKNOWN_ERROR,
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
				const data = CasingUtil.camelCaseKeys(await response.json());
				return { data };
			})
			.catch((e) => {
				return {
					error: {
						code: ApiErrorCode.UNKNOWN_ERROR,
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
						code: ApiErrorCode.UNKNOWN_ERROR,
						message: e,
					},
				};
			});
	}

	private static applyQueriesToRequestUrl(
		url: string,
		opts: DhaagaFetchRequestConfig,
	) {
		return opts.queries
			? `${opts.baseURL!}${url}?` +
					new URLSearchParams(FetchWrapper.cleanObject(opts.queries))
			: `${opts.baseURL!}${url}?`;
	}

	private static buildRequestInitObject(
		opts?: DhaagaFetchRequestConfig,
	): RequestInit {
		if (!opts) return {};
		return {
			...opts,
			headers: opts.accessToken
				? {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${opts.accessToken}`,
					}
				: {
						'Content-Type': 'application/json',
					},
		};
	}

	private static execute() {}

	async get<T>(
		endpoint: string,
		opts?: DhaagaFetchRequestConfig,
	): Promise<LibraryResponse<T>> {
		endpoint = FetchWrapper.applyQueriesToRequestUrl(endpoint, {
			...opts,
			baseURL: opts?.baseURL || this.baseUrl,
		});

		try {
			const response = await fetch(
				endpoint,
				FetchWrapper.buildRequestInitObject({ ...opts, method: 'GET' }),
			);

			if (!response.ok) {
				let errorBody;
				let message = response.statusText;
				let errorCode = ApiErrorCode.UNKNOWN_ERROR;
				try {
					errorBody = await response.json();
					if (typeof errorBody?.error === 'string') message = errorBody.error;

					if (typeof errorBody?.error?.message === 'string')
						message = errorBody.error.message;
				} catch {
					errorBody = await response.text(); // fallback
					console.log('via body', errorBody);
				}

				switch (response.status) {
					case 401: {
						errorCode = ApiErrorCode.UNAUTHORIZED;
						break;
					}
				}

				return {
					error: {
						code: errorCode,
						// status: response.status,
						// statusText: response.statusText,
						// body: errorBody,
						message,
					},
				};
			}

			let data = await response.json();
			if (opts?.transformResponse === 'snake') {
				data = CasingUtil.snakeCaseKeys(data) as T;
			} else if (opts?.transformResponse === 'camel') {
				data = CasingUtil.camelCaseKeys(data) as T;
			}
			return data;
		} catch (e) {
			return {
				error: {
					code: ApiErrorCode.UNKNOWN_ERROR,
					message: e,
				},
			};
		}
	}
}

class DhaagaApiUtils {
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
