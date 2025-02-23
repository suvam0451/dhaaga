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
type BridgedEntityVariant = (typeof searchTabs)[number];

/**
 * These entity types are bridged between
 * platforms and protocols by the bridge codebase
 *
 * They are primitives building blocks used to
 * write platform/protocol agnostic code
 * while using the @dhaaga/bridge library
 *
 * Any API payload can be passed though parsing
 * services to convert them to bridged objects
 *
 * e.g. - PostParser, UserParser, MessageParser
 */
enum BridgedEntity {
	USER,
	POST,
	LINK,
	TAG,
	FEED,
	MESSAGE,
	CHATROOM,
}

export { BridgedEntity };
export type { BridgedEntityVariant };
