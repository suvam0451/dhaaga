import { DefinedUseQueryResult } from '@tanstack/react-query';
import { PostObjectType, ResultPage } from '@dhaaga/bridge';
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

type SimplePostTimelineProps = {
	timelineLabel: string;
	queryResult: DefinedUseQueryResult<ResultPage<PostObjectType>, Error>;
	postProcessingFn?: (input: PostObjectType[]) => PostObjectType[];
	/**
	 *  for certain feed types, it may be beneficial for the parent
	 * 	component to take over the initialization process
	 */
	skipTimelineInit?: boolean;
};

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
}: SimplePostTimelineProps) {
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
		console.log('appending', data.items.length, 'items to timeline');
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

	return (
		<>
			<NavBar_Simple label={timelineLabel} animatedStyle={animatedStyle} />
			<FlatList
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
			/>
			<TimelineLoadingIndicator networkFetchStatus={fetchStatus} />
		</>
	);
}

export default SimplePostTimeline;
