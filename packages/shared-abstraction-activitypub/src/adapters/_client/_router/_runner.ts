import { KNOWN_SOFTWARE } from './instance';
import type { mastodon } from 'masto';
import { createRestAPIClient } from 'masto';
import { DhaagaErrorCode, LibraryResponse } from './_types';
// import * as misskeyApi from 'misskey-js';
import generator, { MegalodonInterface } from 'megalodon';

export enum COMPAT {
	MASTOJS = 'mastodon',
	MISSKEYJS = 'unknown',
	MEGALODON = 'megalodon',
	DHAAGAJS = 'dhaaga',
	BASIC = 'basic',
}

type ClientReturnType = {
	[COMPAT.MASTOJS]: mastodon.rest.Client;
	[COMPAT.MISSKEYJS]: null;
	[COMPAT.MEGALODON]: MegalodonInterface;
	[COMPAT.DHAAGAJS]: null;
	[COMPAT.BASIC]: null;
};

/**
 */
export class DhaagaRestClient<T extends COMPAT> {
	private readonly baseUrl: string;
	private readonly compat: COMPAT | undefined;

	private _software: KNOWN_SOFTWARE;
	private log: boolean;
	private _token: string | null;
	public client: ClientReturnType[T];

	// mastodon.rest.Client | undefined;
	/**
	 * in case we need to call the rest apis
	 * ourselves, instead of using a library
	 */
	public direct: any | null;

	constructor(baseUrl: string, compat?: COMPAT) {
		this.baseUrl = baseUrl;
		this._software = KNOWN_SOFTWARE.UNKNOWN;
		this.log = false;
		this._token = null;
		this.direct = null;
		this.client = null as any;
		this.compat = compat;
	}

	private _MisskeyjsClient() {
		return null;
		// return new misskeyApi.api.APIClient({
		// 	origin: this.baseUrl,
		// 	credential: this._token || undefined,
		// }) as any;
	}

	private _MastojsClient() {
		return createRestAPIClient({
			url: this.baseUrl,
			accessToken: this._token || undefined,
		}) as any;
	}

	private _MegalodonClient() {
		switch (this._software) {
			case KNOWN_SOFTWARE.PLEROMA:
			case KNOWN_SOFTWARE.AKKOMA: {
				return generator(KNOWN_SOFTWARE.PLEROMA, this.baseUrl) as any;
			}
			case KNOWN_SOFTWARE.FIREFISH: {
				return generator(KNOWN_SOFTWARE.FIREFISH, this.baseUrl) as any;
			}
			default: {
				throw new Error(DhaagaErrorCode.SOFTWARE_UNSUPPORTED_BY_LIBRARY);
			}
		}
	}

	private _createCompat() {
		switch (this.compat) {
			case COMPAT.MASTOJS: {
				// this.client = this._MastojsClient();
				break;
			}
			case COMPAT.MISSKEYJS: {
				// this.client = this._MisskeyjsClient();
				break;
			}
			default: {
				return null;
			}
		}
	}

	private _createClient() {
		if (this.compat) return this._createCompat();
		switch (this._software) {
			case KNOWN_SOFTWARE.MASTODON: {
				this.client = this._MastojsClient();
				break;
			}
			case KNOWN_SOFTWARE.MISSKEY: {
				// this.client = this._MisskeyjsClient();
				break;
			}
			case KNOWN_SOFTWARE.PLEROMA:
			case KNOWN_SOFTWARE.AKKOMA: {
				this.client = this._MegalodonClient();
			}
			default: {
			}
		}
	}

	public software(target: KNOWN_SOFTWARE): this {
		this._software = target;
		this._createClient();
		return this;
	}

	public token(x: string): this {
		this._token = x;
		this._createClient();
		return this;
	}
}

async function CommonErrorHandler(e: any) {
	if (e?.response?.data?.error?.code) {
		const code = e?.response?.data?.error?.code;
		return {
			statusCode: e?.response?.status,
			error: {
				code,
				message: code,
			},
		};
	} else if (e?.code) {
		// axios
		return {
			error: {
				code: e.code,
				message: e.code,
			},
		};
	} else {
		console.log('[WARN]: new error', e);
		return {
			error: {
				code: DhaagaErrorCode.UNKNOWN_ERROR,
				message: e,
			},
		};
	}
}

// Define a generic function that takes another function as input
export async function MastoErrorHandler<T extends (...args: any[]) => any>(
	func: T,
): Promise<LibraryResponse<ReturnType<T>>> {
	try {
		return {
			data: await func(),
		};
	} catch (e) {
		// console.log('error');
		return CommonErrorHandler(e);
	}
}

export async function PleromaErrorHandler<T extends (...args: any[]) => any>(
	foo: ThisParameterType<T>,
	func: T,
): Promise<LibraryResponse<ReturnType<T>>> {
	try {
		return {
			data: await func.bind(foo)(),
		};
	} catch (e) {
		return CommonErrorHandler(e);
	}
}

export function DhaagaPleromaClient(baseUrl: string, token?: string) {
	let x = new DhaagaRestClient<COMPAT.MEGALODON>(baseUrl).software(
		KNOWN_SOFTWARE.PLEROMA,
	);
	if (token) x = x.token(token);
	return x;
}

export function DhaagaMastoClient(baseUrl: string, token?: string) {
	let x = new DhaagaRestClient<COMPAT.MASTOJS>(baseUrl).software(
		KNOWN_SOFTWARE.MASTODON,
	);
	if (token) x = x.token(token);
	return x;
}

export function DhaagaMisskeyClient(baseUrl: string, token?: string) {
	let x = new DhaagaRestClient<COMPAT.MISSKEYJS>(baseUrl).software(
		KNOWN_SOFTWARE.MISSKEY,
	);
	if (token) x = x.token(token);
	return x;
}

export function DhaagaBasicClient(baseUrl: string, token?: string) {
	let x = new DhaagaRestClient<COMPAT.BASIC>(baseUrl);
	if (token) {
		x = x.token(token);
	}
	return x;
}
