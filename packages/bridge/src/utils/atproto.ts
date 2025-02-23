import { AtprotoApiAdapter } from '../adapters/index.js';
import { ApiAsyncResult } from './api-result.js';
import { Err, Ok } from './result.js';
import { ApiErrorCode } from '../types/result.types.js';

class Util {
	static async generateFeedUrl(
		client: AtprotoApiAdapter,
		uri: string,
	): ApiAsyncResult<string> {
		const feed = await client.timelines.getFeedGenerator(uri);
		if (feed.error || feed.data === null)
			return Err(ApiErrorCode.UNKNOWN_ERROR);
		if (!feed.data.isValid) return Err('[E_Feed_Invalid]');
		if (!feed.data.isOnline) return Err('[E_Feed_Offline]');

		const regex = /([^/]+)$/;
		if (regex.test(feed.data.view.uri)) {
			const feedUrl = feed.data.view.uri.match(regex)![1];
			const handle = feed.data.view.creator.handle;

			return Ok(`https://bsky.app/profile/${handle}/feed/${feedUrl}`);
		}
		return Err('[E_Feed_Has_Invalid_Regex]');
	}
}

export { Util as AtprotoUtils };
