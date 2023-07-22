import { threadsdb } from "../../wailsjs/go/models";

export class KeystoreService {
	static async verifyMetaThreadsCredentials(
		creds: threadsdb.ThreadsDb_Credential[]
	): Promise<{
		success: boolean;
		data?: { fbLsdToken: string; accessToken: string };
	}> {
		if (!creds)
			return {
				success: false,
			};
		const fbLsdToken = creds.find((o) => o.credential_type === "lsd_token");
		const accessToken = creds.find((o) => o.credential_type === "access_token");

		if (!fbLsdToken || !accessToken)
			return {
				success: false,
			};
		return {
			success: true,
			data: {
				fbLsdToken: fbLsdToken.credential_value,
				accessToken: accessToken.credential_value,
			},
		};
	}
}
