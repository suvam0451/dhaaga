import type { mastodon } from 'masto';
import { RestClient } from '../../native-client.js';
import axios from 'axios';

class AccountsService {
	static verifyCredentials = async (
		client: RestClient,
	): Promise<mastodon.v1.AccountCredentials> => {
		const res = await axios.get<mastodon.v1.AccountCredentials>(
			`https://${client.url}/api/v1/accounts/verify_credentials`,
			{
				headers: {
					Authorization: `Bearer ${client.accessToken}`,
				},
			},
		);
		return res.data;
	};
}

export default AccountsService;
