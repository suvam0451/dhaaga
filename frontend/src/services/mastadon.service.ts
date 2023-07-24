import { notifications } from "@mantine/notifications";
import { BrowserOpenURL } from "../../wailsjs/runtime/runtime";
import { login } from "masto";
import axios from "axios";

export class MastadonService {
	/**
	 * fetches the code used to generate the actual access token
	 * @param instanceUr
	 * @returns
	 */
	static async fetchCode(instanceUr: string) {
		const authEndpoint = `${instanceUr}/oauth/authorize`;

		// Set up parameters for the query string
		const options: Record<string, string> = {
			client_id: import.meta.env.VITE_MASTADON_CLIENT_KEY,
			redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
			response_type: "code",
			scope: "read",
		};

		// Generate the query string
		const queryString = Object.keys(options)
			.map((key) => `${key}=${encodeURIComponent(options[key])}`)
			.join("&");

		// Redirect the user with app credentials to instance sign in
		const loginURI = `${authEndpoint}?${queryString}`;

		try {
			BrowserOpenURL(loginURI);
			return true;
		} catch (e) {
			notifications.show({
				title: "Failed to open system browse",
				message: `[ERROR]: ${e}`,
			});
			return false;
		}
	}

	static async verifyAccessToken(instanceUrl: string, code: string) {
		try {
			const res = await axios.post(`${instanceUrl}/oauth/token`, {
				client_id: import.meta.env.VITE_MASTADON_CLIENT_KEY,
				client_secret: import.meta.env.VITE_MASTODON_CLIENT_SECRET,
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

	static async verifyCredentials(instanceUrl: string, accessToken: string) {
		try {
			const masto = await login({
				url: instanceUrl,
				accessToken: accessToken,
			});

			const result = await masto.v1.accounts.verifyCredentials();
			return {
				profile_pic_url: result.avatar,
				display_name: result.displayName,
				username: result.username,
				accessToken: accessToken,
				instanceUrl: instanceUrl,
			};
		} catch (e) {
			return null;
		}
	}

	async getMyProfile(instanceUrl: string, accessToken: string) {}

	async listPublicTimelineIterable(instanceUrl: string, accessToken: string) {
		const masto = await login({
			url: instanceUrl,
			accessToken: accessToken,
		});

		const result = await masto.v1.accounts.verifyCredentials();
	}

	async getHomeTimeline(instanceUrl: string, accessToken: string) {
		const masto = await login({
			url: instanceUrl,
			accessToken: accessToken,
		});

		const result = await masto.v1.timelines.listHome();
		console.log(result)
		return result;

	}
}
