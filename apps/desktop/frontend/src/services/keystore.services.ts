import { InstagramSafeLogin } from "../../wailsjs/go/main/App";
import { threadsdb } from "../../wailsjs/go/models";
import { ProviderAuthItem } from "../lib/redux/slices/authSlice";

export class KeystoreService {
	static async verifyMetaThreadsCredentials(
		creds: threadsdb.ThreadsDb_Credential[]
	): Promise<{
		success: boolean;
		data?: { fbLsdToken?: string; accessToken: string };
	}> {
		if (!creds)
			return {
				success: false,
			};
		// const fbLsdToken = creds.find((o) => o.credential_type === "lsd_token");
		const accessToken = creds.find((o) => o.credential_type === "access_token");

		if (!accessToken)
			return {
				success: false,
			};
		return {
			success: true,
			data: {
				// fbLsdToken: fbLsdToken.credential_value,
				accessToken: accessToken.credential_value,
			},
		};
	}

	static verifyMastadonCredentials(
		instanceUrl: string,
		creds: threadsdb.ThreadsDb_Credential[]
	):{
		success: boolean;
		data?: {
			instanceUrl: string
			accessToken: string;
			profilePicUrl?: string;
			displayName?: string;
		};
	} {
		const accessToken = creds.find((o) => o.credential_type === "access_token");
		const profilePicUrl = creds.find(
			(o) => o.credential_type === "profile_pic_url"
		);
		const displayName = creds.find((o) => o.credential_type === "display_name");

		if (!accessToken) {
			return {
				success: false,
			};
		} else {
			return {
				success: true,
				data: {
					instanceUrl: instanceUrl,
					accessToken: accessToken.credential_value,
					profilePicUrl: profilePicUrl?.credential_value,
					displayName: displayName?.credential_value,
				},
			};
		}
	}

	/**
	 * Tries to generate access token for a given set of credentials.
	 * If successful, the account and credentials will be saved in the db.
	 *
	 * If failed, an empty string ("") will be returned.
	 * @param username
	 * @param password
	 * @returns Error, or empty string (success)
	 */
	static async verifyInstagramAccount(
		username: string,
		password: string
	): Promise<string> {
		try {
			const res = await InstagramSafeLogin(username, password);
			return res;
		} catch (e) {
			return "Unknown error occured";
		}
	}
}
