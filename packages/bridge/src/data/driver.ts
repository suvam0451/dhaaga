enum KNOWN_SOFTWARE {
	// Fediverse Parent Software
	AKKOMA = 'akkoma',
	// Bluesky
	BLUESKY = 'bluesky',
	CHERRYPICK = 'cherrypick',
	FIREFISH = 'firefish',
	FRIENDICA = 'friendica',
	GOTOSOCIAL = 'gotosocial',
	HOMETOWN = 'hometown',
	ICESHRIMP = 'iceshrimp',
	// smol fork
	KMYBLUE = 'kmyblue',
	LEMMY = 'lemmy',

	MASTODON = 'mastodon',
	MEISSKEY = 'meisskey',
	MISSKEY = 'misskey',

	PEERTUBE = 'peertube',
	PIXELFED = 'pixelfed',
	PLEROMA = 'pleroma',
	SHARKEY = 'sharkey',

	// software could not be detected
	UNKNOWN = 'unknown',
}

const PROTOCOLS = [
	'masto_api_v1',
	'masto_api_v2',
	'misskey_api',
	'atproto',
	'pleroma_api',
] as const;

type ProtocolEnum = (typeof PROTOCOLS)[number];

/**
 * A list of protocols that are expected to be
 * supported by these drivers
 *
 * Empty string means Dhaaga has not implemented
 * support for these drivers yet
 */
const data: Record<KNOWN_SOFTWARE, ProtocolEnum[]> = {
	[KNOWN_SOFTWARE.AKKOMA]: ['masto_api_v1'],
	[KNOWN_SOFTWARE.BLUESKY]: ['atproto'],
	[KNOWN_SOFTWARE.CHERRYPICK]: ['misskey_api'],
	[KNOWN_SOFTWARE.FIREFISH]: ['misskey_api'],
	[KNOWN_SOFTWARE.FRIENDICA]: [],
	[KNOWN_SOFTWARE.GOTOSOCIAL]: [],
	[KNOWN_SOFTWARE.HOMETOWN]: [],
	[KNOWN_SOFTWARE.ICESHRIMP]: ['misskey_api'],
	[KNOWN_SOFTWARE.KMYBLUE]: ['masto_api_v1'],
	[KNOWN_SOFTWARE.LEMMY]: [],
	[KNOWN_SOFTWARE.MASTODON]: ['masto_api_v1', 'masto_api_v2'],
	[KNOWN_SOFTWARE.MEISSKEY]: ['misskey_api'],
	[KNOWN_SOFTWARE.MISSKEY]: ['misskey_api'],
	[KNOWN_SOFTWARE.PEERTUBE]: [],
	[KNOWN_SOFTWARE.PIXELFED]: [],
	[KNOWN_SOFTWARE.PLEROMA]: ['masto_api_v1', 'pleroma_api'],
	[KNOWN_SOFTWARE.SHARKEY]: ['misskey_api'],
	[KNOWN_SOFTWARE.UNKNOWN]: [],
};

enum DriverNotificationType {
	CHAT = 'chat', // direct
	/**
	 * Someone mentioned you in their status
	 */
	MENTION = 'mention', // shared with misskey
	HOME = 'home', // CherryPick ("Home" visibility)
	PUBLIC = 'public', // Misskey ("Public" visibility)
	/**
	 * Someone you enabled notifications for has posted a status
	 */
	STATUS = 'status',
	/**
	 * Someone boosted one of your statuses
	 */
	REBLOG = 'reblog',
	/**
	 * Someone followed you
	 */
	FOLLOW = 'follow', // shared with misskey
	/**
	 * Someone requested to follow you
	 */
	FOLLOW_REQUEST = 'follow_request',
	/**
	 * Someone favourited one of your statuses
	 */
	FAVOURITE = 'favourite',
	/**
	 * A poll you have voted in or created has ended
	 */
	POLL_NOTIFICATION = 'poll',
	/**
	 * A status you interacted with has been edited
	 */
	STATUS_EDITED = 'update',
	/**
	 * Someone signed up (optionally sent to admins)
	 */
	ADMIN_SIGNUP = 'admin.sign_up',
	ADMIN_REPORT = 'admin.report',

	NOTE = 'note', // follow
	// mention
	REPLY = 'reply',
	RENOTE = 'renote',
	QUOTE = 'quote',
	REACTION = 'reaction',
	POLL_ENDED = 'pollEnded',
	FOLLOW_REQUEST_RECEIVED = 'receiveFollowRequest',
	FOLLOW_REQUEST_ACCEPTED = 'followRequestAccepted',
	ROLES_ASSIGNED = 'roleAssigned',
	ACHIEVEMENT_EARNED = 'achievementEarned',
	APP = 'app',
	TEST = 'test',
	REACTION_GROUPED = 'reaction:grouped',
	RENOTE_GROUPED = 'renote:grouped',
	POLL_VOTE = 'pollVote',
	GROUP_INVITED = 'groupInvited',
}

export { data, KNOWN_SOFTWARE, DriverNotificationType };
