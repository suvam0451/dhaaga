import { KNOWN_SOFTWARE } from '@dhaaga/bridge';

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
export const data: Record<KNOWN_SOFTWARE, ProtocolEnum[]> = {
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
