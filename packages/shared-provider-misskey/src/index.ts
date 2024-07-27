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
