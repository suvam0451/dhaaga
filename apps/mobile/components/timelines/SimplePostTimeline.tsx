import { View } from 'react-native';
import type { PostObjectType, ResultPage } from '@dhaaga/bridge/typings';
import { countEmojisInBodyContent } from '@dhaaga/bridge/post-process';
import {
	PostTimelineStateAction,
	usePostTimelineDispatch,
	usePostTimelineState,
} from '@dhaaga/core';
import { useEffect, useState } from 'react';
import NavBar_Simple from '#/components/shared/topnavbar/NavBar_Simple';
import WithAppStatusItemContext from '#/components/containers/contexts/WithPostItemContext';
import { TimelineFilter_EmojiCrash } from '#/components/common/status/TimelineFilter_EmojiCrash';
import StatusItem from '#/components/common/status/StatusItem';
import { appDimensions } from '#/styles/dimensions';
import { TimelineLoadingIndicator } from '#/ui/LoadingIndicator';
import useHideTopNavUsingFlashList from '#/hooks/anim/useHideTopNavUsingFlashList';
import { FlatList, RefreshControl } from 'react-native';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import { SimpleTimelineProps } from '#/components/timelines/shared';
import PostTimelineSkeleton from '#/ui/PostTimelineSkeleton';
import TimelineErrorView from '#/features/timelines/view/TimelineErrorView';
import { DefinedUseQueryResult } from '@tanstack/react-query';
import NavBar_Feed from '#/components/shared/topnavbar/NavBar_Feed';

export function TimelineStateIndicator({
	queryResult,
	containerHeight,
}: {
	containerHeight: number;
	queryResult: DefinedUseQueryResult<ResultPage<PostObjectType>, Error>;
}) {
	const State = usePostTimelineState()!;

	const { isFetched, error, isRefetching } = queryResult;
	if (State.items.length === 0 && (isRefetching || !isFetched))
		return <PostTimelineSkeleton containerHeight={containerHeight} />;
	if (error) return <TimelineErrorView error={error} />;
	return <View />;
}

/**
 * A simple, re-usable timeline renderer
 * with no extra features
 * @constructor
 */
function SimplePostTimeline({
	timelineLabel,
	queryResult,
	postProcessingFn = (input) => countEmojisInBodyContent(input),
	skipTimelineInit,
	feedSwitcherEnabled,
}: SimpleTimelineProps<PostObjectType>) {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { theme } = useAppTheme();
	const State = usePostTimelineState()!;
	const dispatch = usePostTimelineDispatch()!;

	useEffect(() => {
		if (skipTimelineInit) return;
		dispatch({
			type: PostTimelineStateAction.RESET,
		});
	}, []);

	const { fetchStatus, data, status, refetch } = queryResult;

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		dispatch({
			type: PostTimelineStateAction.APPEND_RESULTS,
			payload: { ...data, items: data.items },
		});
	}, [fetchStatus]);

	function onRefresh() {
		setIsRefreshing(true);
		dispatch({
			type: PostTimelineStateAction.RESET,
		});
		refetch().finally(() => setIsRefreshing(false));
	}

	function loadMore() {
		dispatch({
			type: PostTimelineStateAction.REQUEST_LOAD_MORE,
		});
	}
	function onEndReached() {
		if (State.items.length > 0 && fetchStatus !== 'fetching') {
			loadMore();
		}
	}

	const { scrollHandler, animatedStyle } =
		useHideTopNavUsingFlashList(onEndReached);

	const [ContainerHeight, setContainerHeight] = useState(0);
	function onLayout(event: any) {
		setContainerHeight(event.nativeEvent.layout.height);
	}

	return (
		<>
			{feedSwitcherEnabled ? (
				<NavBar_Feed animatedStyle={animatedStyle} />
			) : (
				<NavBar_Simple label={timelineLabel} animatedStyle={animatedStyle} />
			)}
			<FlatList
				onLayout={onLayout}
				data={State.items}
				renderItem={({ item }) => (
					<WithAppStatusItemContext dto={item}>
						<TimelineFilter_EmojiCrash>
							<StatusItem />
						</TimelineFilter_EmojiCrash>
					</WithAppStatusItemContext>
				)}
				onScroll={scrollHandler}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
				}}
				scrollEventThrottle={64}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={onRefresh} />
				}
				style={{ backgroundColor: theme.background.a0 }}
				ListEmptyComponent={
					<TimelineStateIndicator
						containerHeight={ContainerHeight}
						queryResult={queryResult}
					/>
				}
			/>
			<TimelineLoadingIndicator
				numItems={State.items.length}
				networkFetchStatus={fetchStatus}
			/>
		</>
	);
}

export default SimplePostTimeline;
