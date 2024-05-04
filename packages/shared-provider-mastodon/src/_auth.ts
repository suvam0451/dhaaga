import axios from "axios";

export class MastodonService {
	/**
	 * fetches the code used to generate the actual access token
	 * @param instanceUrl
	 * @param clientId
	 * @returns
	 */
	static async createCodeRequestUrl(instanceUrl: string, clientId: string) {
		const authEndpoint = `${instanceUrl}/oauth/authorize`;

		// Set up parameters for the query string
		const options: Record<string, string> = {
			client_id: clientId,
			redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
			response_type: "code",
			scope: "read",
		};

		// Generate the query string
		const queryString = Object.keys(options)
			.map((key) => `${key}=${encodeURIComponent(options[key])}`)
			.join("&");

		// Redirect the user with app credentials to instance sign in
		return `${authEndpoint}?${queryString}`;
	}

	/**
	 * When provided with a code, fetches the access token
	 * @param instanceUrl
	 * @param code
	 * @param clientId
	 * @param clientSecret
	 * @returns
	 */
	static async getAccessToken(
		instanceUrl: string,
		code: string,
		clientId: string,
		clientSecret: string
	) {
		try {
			const res = await axios.post(`${instanceUrl}/oauth/token`, {
				client_id: clientId,
				client_secret: clientSecret,
				redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
				grant_type: "authorization_code",
				code,
				scope: "read write push",
			});

			return res?.data?.access_token;
		} catch (e) {
			return null;
		}
	}
}
