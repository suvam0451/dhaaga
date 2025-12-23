import { router, useNavigation } from 'expo-router';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { useActiveUserSession, useAppApiClient } from '#/states/global/hooks';
import { APP_ROUTING_ENUM } from '#/utils/route-list';

/**
 * Hook to correctly navigate
 * to shared app routes
 */
function useAppNavigator() {
	const { driver } = useAppApiClient();
	const navigator = useNavigation();
	const { acct } = useActiveUserSession();

	function toHome() {
		// probably in the bottom sheet
		if (!navigator || !navigator.getId) return;
		router.navigate(navigator.getId());
	}

	function toPost(id: string, params?: any) {
		// probably in the bottom sheet
		if (!navigator || !navigator.getId) {
			console.log('[WARN]: no navigator!');
			return;
		}

		let __id = id;
		if (driver === KNOWN_SOFTWARE.BLUESKY) {
			__id = 'uri';
		}
		const _id = navigator.getId();
		if (!_id || _id === '/(tabs)/index') {
			router.navigate({
				pathname: `/post/${__id}`,
				params: {
					uri: id,
				},
			});
		} else {
			router.navigate({
				pathname: `${navigator.getId()}/post/${__id}`,
				params: {
					uri: id,
				},
			});
		}
	}

	function toTag(id: string) {
		const _id = navigator.getId();
		if (!_id || _id === '/(tabs)/index' || _id === '/(tabs)') {
			router.navigate(`/tag/${id}`);
		} else {
			router.navigate(`${navigator.getId()}/tag/${id}`);
		}
	}

	function toProfile(id: string) {
		// probably in bottom sheet
		if (!navigator || !navigator.getId) {
			console.log('[WARN]: cannot redirect to profile. navigator missing.');
			return;
		}

		const _id = navigator.getId();
		if (!_id || _id === '/(tabs)/index') {
			router.navigate(`/profile/${id}`);
		} else {
			router.navigate(`${navigator.getId()}/user/${id}`);
		}
	}

	function toFollowers(id: string) {
		// probably in bottom sheet
		if (!navigator || !navigator.getId) return;

		const _id = navigator.getId();
		if (!_id || _id === '/(tabs)/index') {
			router.navigate(`/followers/${id}`);
		} else {
			router.navigate(`${navigator.getId()}/followers/${id}`);
		}
	}

	function toFollows(id: string) {
		// probably in bottom sheet
		if (!navigator || !navigator.getId) return;

		const _id = navigator.getId();
		if (!_id || _id === '/(tabs)/index') {
			router.navigate(`/follows/${id}`);
		} else {
			router.navigate(`${navigator.getId()}/follows/${id}`);
		}
	}

	function toUserPosts(id: string) {
		// probably in the bottom sheet
		if (!navigator || !navigator.getId) return;

		console.log(id, acct.identifier);
		if (id === acct.identifier) {
			router.navigate(APP_ROUTING_ENUM.MY_POSTS);
			return;
		}

		const _id = navigator.getId();
		if (!_id || _id === '/(tabs)/index') {
			router.navigate(`/posts/${id}`);
		} else {
			router.navigate(`${navigator.getId()}/posts/${id}`);
		}
	}

	// TODO: implement <Link withAnchor /> behaviour
	function toTimelineViaPin(pinId: number, pinType: 'feed' | 'user' | 'tag') {
		// probably in the bottom sheet
		if (!navigator || !navigator.getId) return;

		const _id = navigator.getId();
		if (!_id || _id === '/(tabs)/index') {
			router.navigate({
				pathname: `/feed`,
				params: {
					pinId,
					pinType,
				},
			});
		} else {
			router.navigate({
				pathname: `${navigator.getId()}/timelines`,
				params: {
					pinId,
					pinType,
				},
			});
		}
	}

	/**
	 * Each tab has its own dedicated feed
	 * renderer
	 * @param uri
	 * @param label
	 */
	function toFeed(uri: string, label?: string) {
		// probably in the bottom sheet
		if (!navigator || !navigator.getId) return;

		const _id = navigator.getId();
		if (!_id || _id === '/(tabs)/index') {
			router.navigate({
				pathname: `/feed`,
				// TODO: populate with stuff...
				params: {
					// uri: item.uri,
					// displayName: item.displayName,
				},
			});
		} else {
			router.navigate({
				pathname: `${navigator.getId()}/feed`,
				params: {
					uri: uri,
					displayName: label,
				},
			});
		}
	}

	return {
		toPost,
		toHome,
		toProfile,
		toTag,
		toFollowers,
		toFollows,
		toTimelineViaPin,
		toUserPosts,
		toFeed,
	};
}

export default useAppNavigator;
