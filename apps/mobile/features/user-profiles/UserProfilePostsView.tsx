import { useActiveUserSession, useAppApiClient } from '#/states/global/hooks';
import { unifiedPostFeedQueryOptions } from '@dhaaga/react';
import { useQuery } from '@tanstack/react-query';
import {
	PostTimelineCtx,
	PostTimelineStateAction,
	TimelineFetchMode,
	usePostTimelineDispatch,
	usePostTimelineState,
} from '@dhaaga/core';
import { ScrollHandlerProcessed, SharedValue } from 'react-native-reanimated';
import WithAppStatusItemContext from '#/components/containers/contexts/WithPostItemContext';
import { TimelineFilter_EmojiCrash } from '#/components/common/status/TimelineFilter_EmojiCrash';
import PostTimelineEntryView from '#/features/post-item/PostTimelineEntryView';
import { StyleProp, ViewStyle } from 'react-native';
import UserProfileModuleBuilder from '#/features/user-profiles/components/UserProfileModuleBuilder';
import { useEffect } from 'react';

type Props = {
	userId: string;
	onScroll: ScrollHandlerProcessed<Record<string, unknown>>;
	animatedStyle: StyleProp<ViewStyle>;
	headerHeight: SharedValue<number>;
};

function ContentView({ userId, onScroll, animatedStyle, headerHeight }: Props) {
	const { client, driver, server } = useAppApiClient();
	const { acct } = useActiveUserSession();

	const State = usePostTimelineState()!;
	const dispatch = usePostTimelineDispatch()!;

	const queryResult = useQuery(
		unifiedPostFeedQueryOptions(client, driver, server, acct?.identifier, {
			type: TimelineFetchMode.USER,
			maxId: State.appliedMaxId,
			sessionId: State.sessionId,
			limit: 10,
			query: {
				id: userId,
				label: 'N/A',
			},
			opts: {
				bskyFilter: 'posts_no_replies',
			},
		}),
	);

	useEffect(() => {
		dispatch({
			type: PostTimelineStateAction.RESET,
		});
	}, []);

	function onEndReachedDispatch() {
		dispatch({
			type: PostTimelineStateAction.REQUEST_LOAD_MORE,
		});
	}

	function onModuleResetDispatch() {
		dispatch({
			type: PostTimelineStateAction.RESET,
		});
	}

	function onDataLoadedDispatch(data: any) {
		dispatch({
			type: PostTimelineStateAction.APPEND_RESULTS,
			payload: data,
		});
	}

	return (
		<UserProfileModuleBuilder
			queryResult={queryResult}
			onListEndReached={onEndReachedDispatch}
			onDataLoaded={onDataLoadedDispatch}
			onModuleReset={onModuleResetDispatch}
			items={State.items}
			renderItem={({ item }) => (
				<WithAppStatusItemContext dto={item}>
					<TimelineFilter_EmojiCrash>
						<PostTimelineEntryView />
					</TimelineFilter_EmojiCrash>
				</WithAppStatusItemContext>
			)}
			onScroll={onScroll}
			paddingTop={32}
			headerHeight={headerHeight}
			animatedStyle={animatedStyle}
		/>
	);
}

function UserProfilePostsView({
	userId,
	onScroll,
	animatedStyle,
	headerHeight,
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

export default UserProfilePostsView;
