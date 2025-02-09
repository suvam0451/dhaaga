const PROXY_SERVICE_BASE_URL = 'https://suvam.io/api';

class Service {
	/**
	 * Obtain the redirect url to use for oauth
	 *
	 * Based on a "BFF" (Backend for Frontend) implementation
	 *
	 * See https://github.com/bluesky-social/atproto/tree/main/packages/oauth/oauth-client-node#from-a-native-application
	 *
	 * By right, this can be done fully client-side. But the current
	 * implementation of oauth-client-node is very restrictive,
	 * when it comes to react-native
	 *
	 * @param handle of the user logging in
	 * @param pds if not bluesky
	 *
	 * @returns the redirect url to use for oauth
	 */
	static async generateAtprotoRedirectUrl(
		handle: string,
		pds?: string,
	): Promise<{
		success: boolean;
		data?: {
			href: string;
			verifier: string;
		};
		error?: string;
	}> {
		try {
			const response = await fetch(
				`${PROXY_SERVICE_BASE_URL}/atproto-oauth-redirect`,
				{
					method: 'POST',
					body: JSON.stringify({
						handle,
						pds,
					}),
				},
			);
			if (!response.ok) {
				return {
					success: false,
					error: 'Some unknown error occurred',
				};
			}
			return response.json();
		} catch (e) {
			return {
				success: false,
				error: 'Some unknown error occurred',
			};
		}
	}

	/**
	 * Exchange the code with session token
	 *
	 * Based on a "BFF" (Backend for Frontend) implementation
	 *
	 * See https://github.com/bluesky-social/atproto/tree/main/packages/oauth/oauth-client-node#from-a-native-application
	 *
	 * By right, this can be done fully client-side. But the current
	 * implementation of oauth-client-node is very restrictive,
	 * when it comes to react-native
	 *
	 *
	 * @returns the session object to use in the app
	 * @param state
	 * @param code
	 * @param verifier
	 */
	static async exchangeRedirectUrlForSessionObject(
		state: string,
		code: string,
		verifier: string,
	): Promise<{
		success: boolean;
		data?: {
			session: any; // OAuthSession;
			state: string | null;
		};
		error?: string;
	}> {
		const response = await fetch(
			`${PROXY_SERVICE_BASE_URL}/atproto-oauth-callback`,
			{
				method: 'POST',
				body: JSON.stringify({
					state,
					code,
					verifier,
				}),
			},
		);
		if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

		return response.json();
	}
}

export { Service as SuvamIoService };
