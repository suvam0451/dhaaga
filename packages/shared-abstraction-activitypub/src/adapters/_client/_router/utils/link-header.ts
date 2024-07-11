/**
 * Mastodon sometimes embeds the
 * pagination tokens in Link header
 *
 * This function extracts the minId, maxId
 * or returns null
 * @param headers
 */
export function extractPaginationFromLinkHeader(headers: any): {
	minId?: string | null;
	maxId?: string | null;
} {
	const linkHeader = headers?.map?.link;
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
