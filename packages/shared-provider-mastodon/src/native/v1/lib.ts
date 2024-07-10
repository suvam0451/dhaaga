import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';

export async function get<T>(url: string, token?: string) {
	try {
		const axiosClient = axios.create();

		const res = await axiosClient.get<T>(
			url,
			token
				? {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				: undefined,
		);
		return res.data;
	} catch (e) {
		return null;
	}
}

export function getClient() {
	return applyCaseMiddleware.default(axios.create() as any);
}
