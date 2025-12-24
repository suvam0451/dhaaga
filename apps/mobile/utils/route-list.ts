export enum APP_ROUTING_ENUM {
	MISSKEY_SIGNIN = '/(profile)/onboard/signin-mk',
	MISSKEY_SERVER_SELECTION = '/(profile)/onboard/add-misskey',
	MASTODON_SIGNIN = '/(profile)/onboard/signin-md',
	MASTODON_SERVER_SELECTION = '/(profile)/onboard/add-mastodon',
	ATPROTO_SIGNIN = '/(profile)/onboard/add-bluesky',

	// 1. Hub
	HUB_ROOT = '/(hub)',
	HUB_SKINS = '/(hub)/skins',
	HUB_GUIDE = '/(hub)/user-guide',

	// 2. Feed
	FEED_ROOT = '/(feed)/unified',
	FEED_GUIDE = '/(feed)/user-guide',

	// 3. Explore
	EXPLORE_ROOT = '/(explore)/search',
	EXPLORE_HISTORY = '/(explore)/history',
	EXPLORE_GUIDE = '/(explore)/user-guide',

	// 4. Inbox
	INBOX = '/(inbox)',
	INBOX_CHATROOM = '/(inbox)/chatroom',
	INBOX_GUIDE = '/(inbox)/user-guide',
	INBOX_MANAGE_SUBSCRIPTIONS = '/(inbox)/manage-subs',

	// guides (5th tab)
	GUIDE_MY_PROFILE = '/(profile)/user-guide-my-profile',

	// 5 Profile
	PROFILE_TAB = '/(profile)/home',
	MISC_MANAGE_ACCOUNTS = '/(profile)/manage-accounts',
	// 5.1 -- Account Integrations
	PROFILE_GUIDE_ACCOUNTS = '/(profile)/user-guide-accounts',
	PROFILE_ADD_ACCOUNT = '/(profile)/onboard/add-account',
	PROFILE_COLLECTIONS = '/(profile)/account/collections',
	// 5.2 -- Special Features
	SPECIAL_FEATURE_COLLECTION_LIST = '/(profile)/dhaaga/collections',
	SPECIAL_FEATURE_COLLECTION_VIEW = '/(profile)/dhaaga/collection',
	// 5.3 -- Settings
	PROFILE_SETTINGS_GUIDE = '/(profile)/settings/user-guide',

	// Settings Modules
	SETTINGS_PAGE = '/(profile)/settings',
	SETTINGS_TAB_ACCOUNTS = '/(profile)/settings/accounts',
	SETTINGS_TAB_GENERAL = '/(profile)/settings/general',
	SETTINGS_TAB_GOODIE_HUT = '/(profile)/settings/dhaaga',
	SETTINGS_TAB_DIGITAL_WELLBEING = '/(profile)/settings/wellbeing',
	SETTINGS_TAB_ADVANCED = '/(profile)/settings/advanced',
	SETTINGS_PLANS = '/(profile)/onboard/plans',

	SET_APP_LANGUAGE = '/app-language',
	CHATROOM = '/(inbox)/chatroom',

	PROFILES = '/(profile)/dhaaga/hub-profiles',

	MY_LIKES = '/(profile)/account/likes',
	MY_BOOKMARKS = '/(profile)/account/bookmarks',
	MY_LISTS = '/(profile)/account/lists',
	MY_FEEDS = '/(profile)/account/feeds',
	MY_DRAFTS = '/(profile)/account/drafts',
	APP_SKINS = '/(profile)/dhaaga/skins',
	MY_POSTS = '/(profile)/account/posts',
}
