import { KNOWN_SOFTWARE } from '@dhaaga/bridge';

export enum APP_PINNED_OBJECT_TYPE {
	/**
	 * ActivityPub - SNS - Inherited
	 */
	AP_PROTO_MICROBLOG_HOME = 'apProto_microBlog_HOME',
	AP_PROTO_MICROBLOG_LOCAL = 'apProto_microBlog_LOCAL',
	AP_PROTO_MICROBLOG_SOCIAL = 'apProto_microBlog_SOCIAL',
	AP_PROTO_MICROBLOG_BUBBLE = 'apProto_microBlog_BUBBLE',
	AP_PROTO_MICROBLOG_GLOBAL = 'apProto_microBlog_GLOBAL',

	AP_PROTO_MICROBLOG_USER_LOCAL = 'apProto_microBlog_USER_Local',
	AP_PROTO_MICROBLOG_USER_REMOTE = 'apProto_microBlog_USER_Remote',

	AP_PROTO_MICROBLOG_TAG_LOCAL = 'apProto_microBlog_TAG_Local',
	AP_PROTO_MICROBLOG_TAG_REMOTE = 'apProto_microBlog_TAG_Remote',
}

class DriverService {
	/**
	 * @param driver protocol driver enum string
	 * @returns a list of pin objects that should be
	 * populated by default for this protocol driver
	 */
	static getTimelinePins(driver: string): APP_PINNED_OBJECT_TYPE[] {
		const results: APP_PINNED_OBJECT_TYPE[] = [];

		if (driver === KNOWN_SOFTWARE.BLUESKY) return [];

		results.push(APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_HOME);
		results.push(APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_LOCAL);

		if (
			driver === KNOWN_SOFTWARE.SHARKEY ||
			driver === KNOWN_SOFTWARE.MISSKEY
		) {
			results.push(APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_SOCIAL);
		}

		if (driver === KNOWN_SOFTWARE.SHARKEY || driver === KNOWN_SOFTWARE.AKKOMA) {
			results.push(APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_BUBBLE);
		}

		results.push(APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_GLOBAL);
		return results;
	}
}

export default DriverService;
