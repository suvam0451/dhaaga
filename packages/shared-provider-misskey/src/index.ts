import axios from "axios";
import { api as misskeyApi } from "misskey-js";
import uuid from "react-native-uuid";
import { MiauthSessionCheckResponse } from "./types";

export const createClient = (instanceUrl: string, token: string) => {
	const cli = new misskeyApi.APIClient({
		origin: "https://misskey.test",
		credential: "TOKEN",
	});
	return cli;
};

export const verifyToken = async (host: string, session: string) => {
	const res = await axios.post<MiauthSessionCheckResponse>(`${host}/api/miauth/${session}/check`);
	return res.data;
};

export const createCodeRequestUrl = (instanceUrl: string) => {
	const authEndpoint = `${instanceUrl}/miauth/${uuid.v4()}`;

	// Set up parameters for the query string
	const options: Record<string, string> = {
		name: "Dhaaga",
		callback: "https://example.com/",
		permission: "write:notes,write:following,read:drive",
	};

	// Generate the query string
	const queryString = Object.keys(options)
		.map((key) => `${key}=${encodeURIComponent(options[key])}`)
		.join("&");

	return `${authEndpoint}?${queryString}`;
};

// const meta = await cli.request("meta", { detail: true });
