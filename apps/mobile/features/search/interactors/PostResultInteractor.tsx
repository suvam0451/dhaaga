import { useEffect, useState } from 'react';
import { SEARCH_RESULT_TAB } from '../../../services/driver.service';
import {
	PostTimelineStateAction,
	usePostTimelineState,
	usePostTimelineDispatch,
} from '@dhaaga/core';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { Animated, RefreshControl, View } from 'react-native';
import { TimelineLoadingIndicator } from '../../../ui/LoadingIndicator';
import Header from '../components/Header';
import WithAppStatusItemContext from '../../../hooks/ap-proto/useAppStatusItem';
import StatusItem from '../../../components/common/status/StatusItem';
import { useDiscoverState } from '@dhaaga/core';
import { searchPostsQueryOpts } from '@dhaaga/react';
import { useQuery } from '@tanstack/react-query';
import { useAppApiClient } from '#/hooks/utility/global-state-extractors';

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

	/**
	 * Composite Hook Collection
	 */
	const { onScroll } = useScrollMoreOnPageEnd({
		itemCount: TimelineState.items.length,
		updateQueryCache: loadMore,
	});

	return (
		<View
			style={{
				flex: 1,
			}}
		>
			<Animated.FlatList
				data={TimelineState.items}
				renderItem={({ item }) => (
					<WithAppStatusItemContext dto={item}>
						<StatusItem />
					</WithAppStatusItemContext>
				)}
				onScroll={onScroll}
				ListHeaderComponent={Header}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl refreshing={Refreshing} onRefresh={onRefresh} />
				}
			/>
			<TimelineLoadingIndicator networkFetchStatus={fetchStatus} />
		</View>
	);
}

export default PostResultInteractor;
