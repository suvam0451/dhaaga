import { useEffect, useState } from 'react';
import { SEARCH_RESULT_TAB } from '#/services/driver.service';
import {
	PostTimelineStateAction,
	usePostTimelineState,
	usePostTimelineDispatch,
} from '@dhaaga/core';
import { FlatList, RefreshControl, View } from 'react-native';
import { TimelineLoadingIndicator } from '#/ui/LoadingIndicator';
import Header from '../components/Header';
import WithAppStatusItemContext from '#/components/containers/contexts/WithPostItemContext';
import StatusItem from '../../post-view/StatusItem';
import { useDiscoverState } from '@dhaaga/core';
import { searchPostsQueryOpts } from '@dhaaga/react';
import { useQuery } from '@tanstack/react-query';
import { useAppApiClient } from '#/hooks/utility/global-state-extractors';
import useListEndReachedJs from '#/hooks/app/useListEndReachedJs';

type ResultInteractorProps = {
	onDataLoaded: (isEmpty: boolean) => void;
};

function PostResultInteractor({ onDataLoaded }: ResultInteractorProps) {
	const { client, driver, server } = useAppApiClient();
	const [Refreshing, setRefreshing] = useState(false);
	const State = useDiscoverState();
	const TimelineState = usePostTimelineState();
	const TimelineDispatch = usePostTimelineDispatch();
	const { data, fetchStatus, refetch } = useQuery(
		searchPostsQueryOpts(
			client,
			driver,
			server,
			State.q,
			TimelineState.appliedMaxId,
			State.tab === SEARCH_RESULT_TAB.LATEST ? 'latest' : 'top',
		),
	);

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

	return (
		<View
			style={{
				flex: 1,
			}}
		>
			<FlatList
				data={TimelineState.items}
				renderItem={({ item }) => (
					<WithAppStatusItemContext dto={item}>
						<StatusItem />
					</WithAppStatusItemContext>
				)}
				style={{ flex: 1 }}
				onScroll={onScroll}
				ListHeaderComponent={Header}
				scrollEventThrottle={64}
				refreshControl={
					<RefreshControl refreshing={Refreshing} onRefresh={onRefresh} />
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
