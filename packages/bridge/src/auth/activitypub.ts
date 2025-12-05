import { MastoAccountCredentials } from '#/types/mastojs.types.js';
import { MegaAccount } from '#/types/megalodon.types.js';

/**
 * Exchange a code for an access token
 */
export async function getMastodonAccessToken(
	instanceUrl: string,
	code: string,
	clientId: string,
	clientSecret: string,
) {
	const res = await fetch(`https://${instanceUrl}/oauth/token`, {
		method: 'POST',
		body: JSON.stringify({
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
			grant_type: 'authorization_code',
			code,
			scope: 'read write push follow',
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const data = await res.json();
	return data?.access_token;
}

export async function verifyCredentialsAtProto(
	urlLike: string,
	token: string,
): Promise<MastoAccountCredentials | MegaAccount> {
	const res = await fetch(
		`https://${urlLike}/api/v1/accounts/verify_credentials`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		},
	);
	return res.json();
}
