import { useEffect, useState } from 'react';
import {
	useTimelineDispatch,
	useTimelineState,
} from '../../timelines/contexts/PostTimelineCtx';
import { useApiSearchPosts } from '../../../hooks/api/useApiSearch';
import { SEARCH_RESULT_TAB } from '../../../services/driver.service';
import { AppTimelineReducerActionType } from '../../../states/interactors/post-timeline.reducer';
import useLoadingMoreIndicatorState from '../../../states/useLoadingMoreIndicatorState';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { Animated, RefreshControl, View } from 'react-native';
import { TimelineLoadingIndicator } from '../../../ui/LoadingIndicator';
import Header from '../components/Header';
import WithAppStatusItemContext from '../../../hooks/ap-proto/useAppStatusItem';
import StatusItem from '../../../components/common/status/StatusItem';
import { useDiscoverState } from '@dhaaga/core';

type ResultInteractorProps = {
	onDataLoaded: (isEmpty: boolean) => void;
};

function PostResultInteractor({ onDataLoaded }: ResultInteractorProps) {
	const [Refreshing, setRefreshing] = useState(false);
	const State = useDiscoverState();
	const TimelineState = useTimelineState();
	const TimelineDispatch = useTimelineDispatch();
	const { data, fetchStatus, refetch } = useApiSearchPosts(
		State.q,
		TimelineState.appliedMaxId,
		State.tab === SEARCH_RESULT_TAB.LATEST ? 'latest' : 'top',
	);

	useEffect(() => {
		TimelineDispatch({
			type: AppTimelineReducerActionType.RESET,
		});
	}, [State.q]);

	useEffect(() => {
		TimelineDispatch({
			type: AppTimelineReducerActionType.RESET,
		});
		refetch();
	}, [State.tab]);

	useEffect(() => {
		onDataLoaded(false);
		TimelineDispatch({
			type: AppTimelineReducerActionType.APPEND_RESULTS,
			payload: data,
		});
	}, [fetchStatus]);

	function loadMore() {
		TimelineDispatch({
			type: AppTimelineReducerActionType.REQUEST_LOAD_MORE,
		});
	}

	function onRefresh() {
		setRefreshing(true);
		TimelineDispatch({
			type: AppTimelineReducerActionType.RESET,
		});
		refetch().finally(() => {
			setRefreshing(false);
		});
	}

	/**
	 * Composite Hook Collection
	 */
	const { visible, loading } = useLoadingMoreIndicatorState({
		fetchStatus,
	});
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
			<TimelineLoadingIndicator visible={visible} loading={loading} />
		</View>
	);
}

export default PostResultInteractor;
