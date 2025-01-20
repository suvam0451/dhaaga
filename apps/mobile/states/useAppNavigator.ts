import { router, useNavigation } from 'expo-router';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import {
	useAppAcct,
	useAppApiClient,
} from '../hooks/utility/global-state-extractors';
import { APP_ROUTING_ENUM } from '../utils/route-list';

/**
 * Hook to correctly navigate
 * to shared app routes
 */
function useAppNavigator() {
	const { driver } = useAppApiClient();
	const navigator = useNavigation();
	const { acct } = useAppAcct();

	function toHome() {
		// probably in bottom sheet
		if (!navigator || !navigator.getId) return;
		router.navigate(navigator.getId());
	}

	function toPost(id: string, params?: any) {
		// probably in bottom sheet
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
			router.navigate(`${navigator.getId()}/profile/${id}`);
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
		// probably in bottom sheet
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

	function toTimelineViaPin(pinId: number, pinType: 'feed' | 'user' | 'tag') {
		// probably in bottom sheet
		if (!navigator || !navigator.getId) return;

		const _id = navigator.getId();
		if (!_id || _id === '/(tabs)/index') {
			router.push({
				pathname: `/timelines`,
				params: {
					pinId,
					pinType,
				},
			});
		} else {
			router.push({
				pathname: `${navigator.getId()}/timelines`,
				params: {
					pinId,
					pinType,
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
	};
}

export default useAppNavigator;
