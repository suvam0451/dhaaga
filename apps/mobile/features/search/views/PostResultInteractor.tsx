import { useEffect, useState } from 'react';
import { SEARCH_RESULT_TAB } from '#/services/driver.service';
import {
	PostTimelineStateAction,
	usePostTimelineState,
	usePostTimelineDispatch,
} from '@dhaaga/core';
import { FlatList, RefreshControl, View } from 'react-native';
import { TimelineLoadingIndicator } from '#/ui/LoadingIndicator';
import WithAppStatusItemContext from '#/components/containers/contexts/WithPostItemContext';
import PostTimelineEntryView from '../../post-item/PostTimelineEntryView';
import { useDiscoverState } from '@dhaaga/core';
import { searchPostsQueryOpts } from '@dhaaga/react';
import { useQuery } from '@tanstack/react-query';
import { useAppApiClient } from '#/hooks/utility/global-state-extractors';
import useListEndReachedJs from '#/hooks/app/useListEndReachedJs';
import { PostSearchStateIndicator } from '#/features/search/components/StateIndicators';

type ResultInteractorProps = {
	onDataLoaded: (isEmpty: boolean) => void;
};

function PostResultInteractor({ onDataLoaded }: ResultInteractorProps) {
	const { client, driver, server } = useAppApiClient();
	const [Refreshing, setRefreshing] = useState(false);
	const State = useDiscoverState();
	const TimelineState = usePostTimelineState();
	const TimelineDispatch = usePostTimelineDispatch();
	const queryResult = useQuery(
		searchPostsQueryOpts(
			client,
			driver,
			server,
			State.q,
			TimelineState.appliedMaxId,
			State.tab === SEARCH_RESULT_TAB.LATEST ? 'latest' : 'top',
		),
	);
	const { data, fetchStatus, refetch } = queryResult;

	useEffect(() => {
		TimelineDispatch({
			type: PostTimelineStateAction.RESET,
		});
	}, [State.q]);

	useEffect(() => {
		TimelineDispatch({
			type: PostTimelineStateAction.RESET,
		});
		refetch();
	}, [State.tab]);

	useEffect(() => {
		onDataLoaded(false);
		TimelineDispatch({
			type: PostTimelineStateAction.APPEND_RESULTS,
			payload: data,
		});
	}, [fetchStatus]);

	function loadMore() {
		TimelineDispatch({
			type: PostTimelineStateAction.REQUEST_LOAD_MORE,
		});
	}

	function onRefresh() {
		setRefreshing(true);
		TimelineDispatch({
			type: PostTimelineStateAction.RESET,
		});
		refetch().finally(() => {
			setRefreshing(false);
		});
	}

	const { onScroll } = useListEndReachedJs(
		loadMore,
		TimelineState.items.length,
	);

	const [ContainerHeight, setContainerHeight] = useState(0);
	function onLayout(event: any) {
		setContainerHeight(event.nativeEvent.layout.height);
	}

	return (
		<View
			style={{
				flex: 1,
			}}
		>
			<FlatList
				onLayout={onLayout}
				data={TimelineState.items}
				renderItem={({ item }) => (
					<WithAppStatusItemContext dto={item}>
						<PostTimelineEntryView />
					</WithAppStatusItemContext>
				)}
				style={{ flex: 1 }}
				onScroll={onScroll}
				scrollEventThrottle={64}
				refreshControl={
					<RefreshControl refreshing={Refreshing} onRefresh={onRefresh} />
				}
				ListEmptyComponent={
					<PostSearchStateIndicator
						queryResult={queryResult}
						containerHeight={ContainerHeight}
					/>
				}
			/>
			<TimelineLoadingIndicator
				numItems={TimelineState.items.length}
				networkFetchStatus={fetchStatus}
			/>
		</View>
	);
}

export default PostResultInteractor;
