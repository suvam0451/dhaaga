import { APP_PINNED_OBJECT_TYPE } from '../types/db.types.js';
import { KNOWN_SOFTWARE, DriverService } from '@dhaaga/bridge';

const searchTabs = [
	'top',
	'latest',
	'feeds',
	'posts',
	'users',
	'tags',
	'links',
	'news',
	'home',
] as const;
type SearchTabType = (typeof searchTabs)[number];

/**
 * @param driver protocol driver enum string
 * @returns a list of pin objects that should be
 * populated by default for this protocol driver
 */
function getTimelinePins(driver: string): APP_PINNED_OBJECT_TYPE[] {
	const results: APP_PINNED_OBJECT_TYPE[] = [];

	if (driver === KNOWN_SOFTWARE.BLUESKY) {
		return [APP_PINNED_OBJECT_TYPE.AT_PROTO_MICROBLOG_HOME];
	}

	results.push(APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_HOME);
	results.push(APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_LOCAL);

	if (driver === KNOWN_SOFTWARE.SHARKEY || driver === KNOWN_SOFTWARE.MISSKEY) {
		results.push(APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_SOCIAL);
	}

	if (driver === KNOWN_SOFTWARE.SHARKEY || driver === KNOWN_SOFTWARE.AKKOMA) {
		results.push(APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_BUBBLE);
	}

	results.push(APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_GLOBAL);
	return results;
}

/**
 * @param driver protocol driver enum string
 * @returns a list of search destinations, that
 * should appear above the search widget
 */
function getSearchTabs(driver: KNOWN_SOFTWARE | string): SearchTabType[] {
	if (DriverService.supportsAtProto(driver)) {
		return ['top', 'latest', 'users', 'feeds'];
	} else if (DriverService.supportsMisskeyApi(driver)) {
		return ['posts', 'users'];
	} else if (driver === KNOWN_SOFTWARE.MASTODON) {
		return ['posts', 'tags', 'users']; // news
	} else if (DriverService.supportsPleromaApi(driver)) {
		return ['posts', 'users'];
	} else {
		return [];
	}
}

export { getTimelinePins, getSearchTabs };
