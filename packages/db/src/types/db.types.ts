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

	/**
	 * AT Protocol
	 */
	AT_PROTO_MICROBLOG_HOME = 'atProto_microBlog_HOME', // Following
	AT_PROTO_MICROBLOG_DISCOVER = 'atProto_microBlog_DISCOVER', // Discover
	AT_PROTO_MICROBLOG_FEED = 'apProto_microBlog_FEED', // Any feed with uri
}

export const DATABASE_NAME = 'app.db';
