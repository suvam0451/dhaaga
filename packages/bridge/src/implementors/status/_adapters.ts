import { PostTargetInterface } from './_interface.js';
import MisskeyApiPostAdapter from './misskey.js';
import MastoApiPostAdapter from './mastodon.js';
import AtprotoPostAdapter from './bluesky.js';
import { CasingUtil } from '../../utils/casing.js';
import { DriverService } from '../../services/driver.js';

/**
 * @param status any status object
 * @param driver driver from database
 * @returns PostTargetInterface
 */
export function ActivitypubStatusAdapter(
	status: any,
	driver: string,
): PostTargetInterface | null {
	if (DriverService.supportsMisskeyApi(driver))
		return new MisskeyApiPostAdapter(status);
	if (DriverService.supportsPleromaApi(driver)) {
		const _camel = CasingUtil.camelCaseKeys(status);
		return new MastoApiPostAdapter(_camel as any);
	}
	if (DriverService.supportsAtProto(driver)) {
		/**
		 * What even makes a post be blocked/notfound?
		 */
		if (status?.['$type'] === 'app.bsky.feed.defs#blockedPost')
			return null as any;

		/**
		 * has post, reply, reason objects
		 *
		 * // Context provided by feed generator that may be passed back alongside interactions.
		 * feedContext
		 */
		if (status.$type === 'app.bsky.feed.defs#feedViewPost') {
		}

		return new AtprotoPostAdapter(
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
	if (DriverService.supportsMastoApiV2(driver)) {
		return new MastoApiPostAdapter(status);
	}

	console.log('[WARN]: driver not handled', driver);
	return null;
}
