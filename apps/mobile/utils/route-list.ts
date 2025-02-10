export enum APP_ROUTING_ENUM {
	MISSKEY_SIGNIN = '/profile/onboard/signin-mk',
	MISSKEY_SERVER_SELECTION = '/profile/onboard/add-misskey',
	MASTODON_SIGNIN = '/profile/onboard/signin-md',
	MASTODON_SERVER_SELECTION = '/profile/onboard/add-mastodon',
	ATPROTO_SIGNIN = '/profile/onboard/add-bluesky',

	// discover modules
	DISCOVER_FEED = '/discover/feed',

	// guides
	GUIDE_NEW_TAB_INTERFACE = '/user-guide-profiles',
	GUIDE_INBOX = '/notifications/user-guide',

	GUIDE_DISCOVER_TAB = '/discover/user-guide',
	GUIDE_SETTINGS_TAB = '/profile/user-guide-settings',
	// guides (5th tab)
	GUIDE_MY_PROFILE = '/profile/user-guide-my-profile',
	GUIDE_TIMELINES = '/user-guide-timelines',
	GUIDE_COMPOSER = '/apps/user-guide',

	SELECT_DRIVER = '/profile/pick-driver',

	// Settings Modules
	SETTINGS_PAGE = '/profile/settings',
	SETTINGS_TAB_ACCOUNTS = '/profile/settings/accounts',
	SETTINGS_TAB_GENERAL = '/profile/settings/general',
	SETTINGS_TAB_GOODIE_HUT = '/profile/settings/dhaaga',
	SETTINGS_TAB_DIGITAL_WELLBEING = '/profile/settings/wellbeing',
	SETTINGS_TAB_ADVANCED = '/profile/settings/advanced',

	SETTINGS_GENERAL_APP_LANGUAGE = '/profile/settings/general/app-language',

	NOTIFICATIONS_MENTIONS = '/notifications',
	NOTIFICATIONS_CHAT = '/notifications/chat',
	NOTIFICATIONS_SOCIAL = '/notifications/social',
	NOTIFICATIONS_UPDATES = '/notifications/updates',
	CHATROOM = '/notifications/chatroom',

	COLLECTIONS = '/profile/collections',
	PROFILES = '/profile/profiles',

	MY_LIKES = '/profile/account/likes',
	MY_BOOKMARKS = '/profile/account/bookmarks',
	MY_LISTS = '/profile/account/lists',
	MY_FEEDS = '/profile/account/feeds',
	MY_DRAFTS = '/profile/account/drafts',
	MY_POSTS = '/profile/account/posts',

	APP_FEATURE_COLLECTION = '/profile/app-features/collection',
}
