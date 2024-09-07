import { useCallback } from 'react';
import { router, useNavigation } from 'expo-router';

function useAppNavigator() {
	const navigator = useNavigation();

	const toHome = useCallback(() => {
		// probably in bottom sheet
		if (!navigator || !navigator.getId) return;
		router.navigate(navigator.getId());
	}, [navigator]);

	const toPost = useCallback(
		(id: string) => {
			// probably in bottom sheet
			if (!navigator || !navigator.getId) return;

			const _id = navigator.getId();
			if (!_id || _id === '/(tabs)/index') {
				router.navigate(`/post/${id}`);
			} else {
				router.navigate(`${navigator.getId()}/post/${id}`);
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

	return { toPost, toHome, toProfile, toTag };
}

export default useAppNavigator;
