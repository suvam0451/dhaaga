import axios from 'axios';

/**
 * Mastodon sometimes embeds the
 * pagination tokens in Link header
 *
 * This function extracts the minId, maxId
 * or returns null
 * @param headers
 */
export function extractPaginationFromLinkHeader(headers: any) {
	const linkHeader = headers['link'];
	const maxIdRegex = /max_id=([0-9]+)/;
	const minIdRegex = /min_id=([0-9]+)/;

	let maxId = null;
	let minId = null;
	if (minIdRegex.test(linkHeader)) {
		const minMatch = linkHeader.match(minIdRegex);
		minId = minMatch[1];
	}
	if (maxIdRegex.test(linkHeader)) {
		const maxMatch = linkHeader.match(maxIdRegex);
		maxId = maxMatch[1];
	}

	return { minId, maxId };
}

/**
 * Helper function to insert query params
 * @param baseUrl
 * @param query
 */
export function buildQueryUrl(baseUrl: string, query?: any) {
	baseUrl = baseUrl.concat(`?limit=${query.limit}`);
	if (query?.maxId) {
		baseUrl = baseUrl.concat(`&max_id=${query?.maxId}`);
	}
	if (query?.minId) {
		baseUrl = baseUrl.concat(`&min_id=${query?.minId}`);
	}
	return baseUrl;
}

export function getAxiosClient() {
	return axios.create();
}
