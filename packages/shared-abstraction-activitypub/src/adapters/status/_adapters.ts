import MisskeyToStatusAdapter from './misskey.js';
import MastodonToStatusAdapter from './mastodon.js';
import { mastodon } from '@dhaaga/shared-provider-mastodon';
import UnknownToStatusAdapter from './default.js';
import { StatusInterface } from './_interface.js';
import { KNOWN_SOFTWARE } from '../_client/_router/routes/instance.js';
import camelcaseKeys from 'camelcase-keys';
import BlueskyStatusAdapter from './bluesky.js';

/**
 * @param status any status object
 * @param domain domain from database
 * @returns StatusInterface
 */
export function ActivitypubStatusAdapter(
	status: any,
	domain: string,
): StatusInterface {
	switch (domain) {
		case KNOWN_SOFTWARE.MISSKEY:
		case KNOWN_SOFTWARE.FIREFISH:
		case KNOWN_SOFTWARE.SHARKEY:
		case KNOWN_SOFTWARE.MEISSKEY:
		case KNOWN_SOFTWARE.KMYBLUE:
		case KNOWN_SOFTWARE.CHERRYPICK: {
			return new MisskeyToStatusAdapter(status);
		}

		case KNOWN_SOFTWARE.MASTODON: {
			return new MastodonToStatusAdapter(status);
		}

		case KNOWN_SOFTWARE.PLEROMA:
		case KNOWN_SOFTWARE.AKKOMA: {
			const _camel = camelcaseKeys(status, { deep: true });
			return new MastodonToStatusAdapter(_camel as mastodon.v1.Status);
		}
		case KNOWN_SOFTWARE.BLUESKY: {
			/**
			 * What even makes a post be blocked/notfound?
			 */
			if (status?.['$type'] === 'app.bsky.feed.defs#blockedPost')
				return null as any;

			return new BlueskyStatusAdapter(
				status?.post
					? {
							// FeedPostView
							post: status.post,
							reply: status.reply,
							reason: status.reason,
						}
					: {
							// PostView
							post: status,
							reply: undefined,
							reason: undefined,
						},
			);
		}
		default: {
			return new UnknownToStatusAdapter();
		}
	}
}
