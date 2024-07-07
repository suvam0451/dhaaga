import axios from 'axios';
import { api as misskeyApi } from 'misskey-js';
import { MiauthSessionCheckResponse } from './types.js';

export { api as misskeyApi } from 'misskey-js';

export const createClient = (instanceUrl: string, token: string) => {
	return new misskeyApi.APIClient({
		origin: instanceUrl,
		credential: token,
	});
};

export const verifyToken = async (host: string, session: string) => {
	const res = await axios.post<MiauthSessionCheckResponse>(
		`${host}/api/miauth/${session}/check`,
	);
	return res.data;
};

export const createCodeRequestUrl = (instanceUrl: string, uuid: string) => {
	const authEndpoint = `${instanceUrl}/miauth/${uuid}`;

	// Set up parameters for the query string
	const options: Record<string, string> = {
		name: 'Dhaaga',
		callback: 'https://example.com/',
		permission: 'write:notes,write:following,read:drive',
	};

	// Generate the query string
	const queryString = Object.keys(options)
		.map((key) => `${key}=${encodeURIComponent(options[key])}`)
		.join('&');

	return `${authEndpoint}?${queryString}`;
};

export class NotesAPI {
	static async localTimeline(client: misskeyApi.APIClient) {
		return await client.request('notes/local-timeline', { limit: 20 });
	}
}
