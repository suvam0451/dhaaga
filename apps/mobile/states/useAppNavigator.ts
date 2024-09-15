import { useCallback } from 'react';
import { router, useNavigation } from 'expo-router';
import { useActivityPubRestClientContext } from './useActivityPubRestClient';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';

/**
 * Hook to correctly navigate
 * to shared app routes
 */
function useAppNavigator() {
	const { domain } = useActivityPubRestClientContext();
	const navigator = useNavigation();

	const toHome = useCallback(() => {
		// probably in bottom sheet
		if (!navigator || !navigator.getId) return;
		router.navigate(navigator.getId());
	}, [navigator]);

	const toPost = useCallback(
		(id: string, params?: any) => {
			// probably in bottom sheet
			if (!navigator || !navigator.getId) return;

			let __id = id;
			if (domain === KNOWN_SOFTWARE.BLUESKY) {
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
		},
		[navigator],
	);

	const toTag = useCallback(
		(id: string) => {
			const _id = navigator.getId();
			if (!_id || _id === '/(tabs)/index' || _id === '/(tabs)') {
				router.navigate(`/tag/${id}`);
			} else {
				router.navigate(`${navigator.getId()}/tag/${id}`);
			}
		},
		[navigator],
	);

	const toProfile = useCallback(
		(id: string) => {
			// probably in bottom sheet
			if (!navigator || !navigator.getId) return;

			const _id = navigator.getId();
			if (!_id || _id === '/(tabs)/index') {
				router.navigate(`/profile/${id}`);
			} else {
				router.navigate(`${navigator.getId()}/profile/${id}`);
			}
		},
		[navigator],
	);

	const toFollowers = useCallback(
		(id: string) => {
			// probably in bottom sheet
			if (!navigator || !navigator.getId) return;

			const _id = navigator.getId();
			if (!_id || _id === '/(tabs)/index') {
				router.navigate(`/followers/${id}`);
			} else {
				router.navigate(`${navigator.getId()}/followers/${id}`);
			}
		},
		[navigator],
	);

	const toFollows = useCallback(
		(id: string) => {
			// probably in bottom sheet
			if (!navigator || !navigator.getId) return;

			const _id = navigator.getId();
			if (!_id || _id === '/(tabs)/index') {
				router.navigate(`/follows/${id}`);
			} else {
				router.navigate(`${navigator.getId()}/follows/${id}`);
			}
		},
		[navigator],
	);

	return { toPost, toHome, toProfile, toTag, toFollowers, toFollows };
}

export default useAppNavigator;
