import {
	generateDhaagaAuthStrategy,
	exchangeCodeForAccessToken,
	verifyCredentialsActivitypub,
} from '@dhaaga/bridge';

export class AuthService {
	static async initiateMastodonAuth(instanceUrl: string) {
		const strategy = await generateDhaagaAuthStrategy(instanceUrl, {
			appName: 'Dhaaga Web',
			appWebsite: 'https://dhaaga.suvam.io',
			appCallback: 'urn:ietf:wg:oauth:2.0:oob',
		});
		return strategy;
	}

	static async completeMastodonAuth(
		instanceUrl: string,
		code: string,
		clientId: string,
		clientSecret: string,
	) {
		const accessToken = await exchangeCodeForAccessToken(
			instanceUrl,
			code,
			clientId,
			clientSecret,
		);

		if (!accessToken) {
			throw new Error('Failed to obtain access token');
		}

		const user = await verifyCredentialsActivitypub(instanceUrl, accessToken);

		return {
			accessToken,
			user: {
				id: user.id,
				displayName: user.displayName,
				avatarUrl: user.avatarUrl,
				handle: user.handle,
			},
		};
	}
}
