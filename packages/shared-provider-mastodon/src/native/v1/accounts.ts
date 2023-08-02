import type { mastodon } from "masto";
import { RestClient } from "../../native-client";
import axios from "axios";

export default class AccountsService {
	static verifyCredentials = async (
		client: RestClient
	): Promise<mastodon.v1.AccountCredentials> => {
		const res = await axios.get<mastodon.v1.AccountCredentials>(
			`${client.url}/api/v1/accounts/verify_credentials`,
			{
				headers: {
					Authorization: `Bearer ${client.accessToken}`,
				},
			}
		);
		return res.data;
	};
}
