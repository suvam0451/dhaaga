import { APP_ROUTING_ENUM } from '#/utils/route-list';
import { RandomUtil } from '@dhaaga/bridge';
import { router } from 'expo-router';

/**
 * Utility functions to help us perform
 * navigations (specially when pager views
 * are concerned) easier
 */
class RoutingUtils {
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
			pathname: APP_ROUTING_ENUM.PROFILE_TAB,
			params: {
				requestId: RandomUtil.nanoId(),
				pagerIndex: 1,
			},
		});
	}

	static toAppSettings() {
		router.navigate({
			pathname: APP_ROUTING_ENUM.PROFILE_TAB,
			params: {
				requestId: RandomUtil.nanoId(),
				pagerIndex: 2,
			},
		});
	}
}

export default RoutingUtils;
