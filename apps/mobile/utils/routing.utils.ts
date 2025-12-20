import { APP_ROUTING_ENUM } from '#/utils/route-list';
import { RandomUtil } from '@dhaaga/bridge';
import { router } from 'expo-router';

/**
 * Utility functions to help us perform
 * navigations (specially when pager views
 * are concerned) easier
 */
class RoutingUtils {
	/**
	 * Hub
	 */

	static toHubUserGuide() {
		router.navigate({
			pathname: APP_ROUTING_ENUM.HUB_GUIDE,
		});
	}

	static toHubSkinSelection() {
		router.navigate({
			pathname: APP_ROUTING_ENUM.HUB_SKINS,
		});
	}

	static toTimelineUserGuide() {
		router.navigate({
			pathname: APP_ROUTING_ENUM.FEED_GUIDE,
		});
	}

	static toMentionInbox() {
		router.navigate({
			pathname: APP_ROUTING_ENUM.INBOX,
			params: {
				requestId: RandomUtil.nanoId(),
				pagerIndex: 0,
			},
		});
	}

	static toChatInbox() {
		router.navigate({
			pathname: APP_ROUTING_ENUM.INBOX,
			params: {
				requestId: RandomUtil.nanoId(),
				pagerIndex: 1,
			},
		});
	}

	static toSocialInbox() {
		router.navigate({
			pathname: APP_ROUTING_ENUM.INBOX,
			params: {
				requestId: RandomUtil.nanoId(),
				pagerIndex: 2,
			},
		});
	}

	static toUpdateInbox() {
		router.navigate({
			pathname: APP_ROUTING_ENUM.INBOX,
			params: {
				requestId: RandomUtil.nanoId(),
				pagerIndex: 3,
			},
		});
	}

	static toChatroom(roomId: string) {
		router.navigate({
			pathname: APP_ROUTING_ENUM.CHATROOM,
			params: {
				roomId: roomId,
			},
		});
	}

	static toHome() {
		router.navigate({
			pathname: APP_ROUTING_ENUM.PROFILE_TAB,
			params: {
				requestId: RandomUtil.nanoId(),
				pagerIndex: 0,
			},
		});
	}

	static toAccountManagement() {
		router.navigate({
			pathname: APP_ROUTING_ENUM.MISC_MANAGE_ACCOUNTS,
		});
	}

	static toOnboarding() {
		router.navigate({
			pathname: APP_ROUTING_ENUM.PROFILE_ADD_ACCOUNT,
		});
	}

	static toFirstTimeOnboarding() {
		router.navigate({
			pathname: APP_ROUTING_ENUM.PROFILE_TAB,
		});
	}

	static toAppSettings() {
		router.navigate({
			pathname: APP_ROUTING_ENUM.SETTINGS_PAGE,
		});
	}
}

export default RoutingUtils;
