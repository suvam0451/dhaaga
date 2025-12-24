import {
	PostTimelineCtx,
	PostTimelineStateAction,
	usePostTimelineDispatch,
	usePostTimelineState,
} from '@dhaaga/core';
import { useLocalSearchParams } from 'expo-router';
import useTimelineQueryReactNative from '#/hooks/useTimelineQueryReactNative';
import PostTimelineView from '#/features/timelines/view/PostTimelineView';
import { useActiveUserSession, useAppDb } from '#/states/global/hooks';
import { useEffect } from 'react';
import { View } from 'react-native';

function Generator() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { db } = useAppDb();
	const { acct } = useActiveUserSession();

	// state management
	const State = usePostTimelineState();
	const dispatch = usePostTimelineDispatch();

	useEffect(() => {
		if (!db) return;
		dispatch({
			type: PostTimelineStateAction.INIT,
			payload: {
				db,
			},
		});

		dispatch({
			type: PostTimelineStateAction.SETUP_USER_POST_TIMELINE,
			payload: {
				id,
				label: acct?.displayName || acct?.username,
			},
		});
	}, [db]);

	const queryResult = useTimelineQueryReactNative({
		type: State.feedType,
		query: State.query,
		opts: State.opts,
		maxId: State.appliedMaxId,
	});

	if (!id) return <View />;
	return (
		<PostTimelineView
			label={'All Posts'}
			queryResult={queryResult}
			navbarType={'simple'}
			flatListKey={'user/posts'}
			skipTimelineInit
			itemType={'post'}
		/>
	);
}

function UserPostsPage() {
	return (
		<PostTimelineCtx>
			<Generator />
		</PostTimelineCtx>
	);
}

export default UserPostsPage;
