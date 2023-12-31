import {
	GetAccount,
	UpsertAccount,
	UpsertCredential,
} from "../../wailsjs/go/main/App";

export class MastadonWorker {
	/**
	 * Onboard the (pre-validated) user in the database
	 * @param subdomain mastodon server full url
	 * @param meta generated by a service function
	 * @returns true if successful, false otherwise
	 */
	static async onboardUser(
		subdomain: string,
		meta: {
			profile_pic_url: string;
			display_name: string;
			username: string;
			accessToken: string;
			instanceUrl: string;
		}
	) {
		try {
			await UpsertAccount({
				domain: "mastodon",
				subdomain: subdomain,
				username: meta.username,
				password: "",
				verified: true,
			});

			const account = await GetAccount("mastodon", subdomain, meta.username);
			await UpsertCredential(account, "access_token", meta!.accessToken);
			await UpsertCredential(account, "display_name", meta!.display_name);
			await UpsertCredential(account, "profile_pic_url", meta!.profile_pic_url);
			return {
				success: true,
			};
		} catch (e) {
			return {
				success: false,
				error: "unknown error occured",
			};
		}
	}
}
