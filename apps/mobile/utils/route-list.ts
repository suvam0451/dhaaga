export enum APP_ROUTING_ENUM {
	MISSKEY_SIGNIN = '/profile/onboard/signin-mk',
	MISSKEY_SERVER_SELECTION = '/profile/onboard/add-misskey',
	MASTODON_SIGNIN = '/profile/onboard/signin-md',
	MASTODON_SERVER_SELECTION = '/profile/onboard/add-mastodon',
	ATPROTO_SIGNIN = '/profile/onboard/add-bluesky',

	// 2. Feed
	FEED_ROOT = '/feed',
	FEED_GUIDE = '/feed/user-guide',

	// 3. Explore
	EXPLORE_ROOT = '/explore',
	EXPLORE_GUIDE = '/explore/user-guide',
	EXPLORE_FEED = '/explore/feed',
	EXPLORE_HISTORY = '/explore/history',

	// 4. Inbox
	INBOX_GUIDE = '/inbox/user-guide',
	INBOX_MANAGE_SUBSCRIPTIONS = '/inbox/manage-subscriptions',

	// guides (5th tab)
	GUIDE_MY_PROFILE = '/profile/user-guide-my-profile',

	ADD_ACCOUNT = '/profile/onboard/add-account',

	PROFILE_TAB = '/profile',
	// Settings Modules
	SETTINGS_PAGE = '/profile/settings',
	SETTINGS_TAB_ACCOUNTS = '/profile/settings/accounts',
	SETTINGS_TAB_GENERAL = '/profile/settings/general',
	SETTINGS_TAB_GOODIE_HUT = '/profile/settings/dhaaga',
	SETTINGS_TAB_DIGITAL_WELLBEING = '/profile/settings/wellbeing',
	SETTINGS_TAB_ADVANCED = '/profile/settings/advanced',

	SETTINGS_GENERAL_APP_LANGUAGE = '/profile/settings/general/app-language',
	CHATROOM = '/inbox/chatroom',

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
