import axios from 'axios';

export class MastodonService {
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
		clientSecret: string,
	) {
		try {
			const res = await axios.post(`https://${instanceUrl}/oauth/token`, {
				client_id: clientId,
				client_secret: clientSecret,
				redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
				grant_type: 'authorization_code',
				code,
				scope: 'read write push follow',
			});

			return res?.data?.access_token;
		} catch (e) {
			console.log('[ERROR]: obtaining mastodon token', e);
			return null;
		}
	}
}
