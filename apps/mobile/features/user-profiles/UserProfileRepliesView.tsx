import {
	PostTimelineCtx,
	PostTimelineStateAction,
	TimelineFetchMode,
	usePostTimelineDispatch,
	usePostTimelineState,
} from '@dhaaga/core';
import {
	useActiveUserSession,
	useAppApiClient,
	useAppTheme,
} from '#/states/global/hooks';
import { RefreshControl, StyleProp, ViewStyle } from 'react-native';
import Animated, {
	ScrollHandlerProcessed,
	SharedValue,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { unifiedPostFeedQueryOptions } from '@dhaaga/react';
import WithAppStatusItemContext from '#/components/containers/contexts/WithPostItemContext';
import { TimelineFilter_EmojiCrash } from '#/components/common/status/TimelineFilter_EmojiCrash';
import PostTimelineEntryView from '#/features/post-item/PostTimelineEntryView';
import { useQuery } from '@tanstack/react-query';

type Props = {
	userId: string;
	onScroll: ScrollHandlerProcessed<Record<string, unknown>>;
	animatedStyle: StyleProp<ViewStyle>;
	headerHeight: SharedValue<number>;
};

function ContentView({ userId, onScroll, headerHeight }: Props) {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { client, driver, server } = useAppApiClient();
	const { acct } = useActiveUserSession();
	const { theme } = useAppTheme();

	const State = usePostTimelineState()!;
	const dispatch = usePostTimelineDispatch()!;

	const queryResult = useQuery(
		unifiedPostFeedQueryOptions(client, driver, server, acct?.identifier, {
			type: TimelineFetchMode.USER,
			maxId: State.appliedMaxId,
			sessionId: State.sessionId,
			query: {
				id: userId,
				label: 'N/A',
			},
			opts: { bskyFilter: 'posts_with_replies' },
		}),
	);
	const { fetchStatus, data, status, refetch } = queryResult;

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		dispatch({
			type: PostTimelineStateAction.APPEND_RESULTS,
			payload: data,
		});
	}, [fetchStatus]);

	function onRefresh() {
		setIsRefreshing(true);
		dispatch({
			type: PostTimelineStateAction.RESET,
		});
		refetch().finally(() => setIsRefreshing(false));
	}

	return (
		<Animated.FlatList
			data={State.items}
			onScroll={onScroll}
			renderItem={({ item }) => (
				<WithAppStatusItemContext dto={item}>
					<TimelineFilter_EmojiCrash>
						<PostTimelineEntryView />
					</TimelineFilter_EmojiCrash>
				</WithAppStatusItemContext>
			)}
			refreshControl={
				<RefreshControl refreshing={IsRefreshing} onRefresh={onRefresh} />
			}
			ListHeaderComponent={
				<Animated.View style={{ height: headerHeight.value }} />
			}
			contentContainerStyle={{ paddingTop: 16 }}
			style={[{ backgroundColor: theme.background.a0 }]}
		/>
	);
}

function UserProfileRepliesView({
	userId,
	onScroll,
	headerHeight,
	animatedStyle,
}: Props) {
	return (
		<PostTimelineCtx>
			<ContentView
				userId={userId}
				onScroll={onScroll}
				animatedStyle={animatedStyle}
				headerHeight={headerHeight}
			/>
		</PostTimelineCtx>
	);
}

export default UserProfileRepliesView;
