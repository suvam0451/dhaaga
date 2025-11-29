export type AtpLoginResponse = {
	success: boolean;
	headers: {
		'access-control-allow-origin': '*';
		'content-type': 'application/json; charset=utf-8';
		date: Date;
		etag: string;
		'ratelimit-limit': string; // "30",
		'ratelimit-policy': string; // "30;w=300",
		// e.g. - login attempts remaining
		'ratelimit-remaining': string; // "28", ->
		'ratelimit-reset': string; // "1725883254",
		vary: 'Accept-Encoding';
		'x-powered-by': 'Express';
	};
	data: {
		// tokens
		accessJwt: string;
		refreshJwt: string;
		did: string;
		handle: string;

		// checks
		active: boolean;

		// pii
		email: string;

		didDoc: any; // TODO: is this required for anything?
		emailAuthFactor: false;
		emailConfirmed: false;
	};
};

export type AppAtpSessionData = any & {
	subdomain: string;
	pdsUrl: string;
	/**
	 * a unique identifier to help trigger react hooks
	 * and reset all pages when the api client
	 * changes
	 */
	clientId: string | number;
};
