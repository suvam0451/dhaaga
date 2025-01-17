import { useEffect, useState } from 'react';
import { useDiscoverTabState } from '../contexts/DiscoverTabCtx';
import {
	useTimelineDispatch,
	useTimelineState,
} from '../../../components/context-wrappers/WithPostTimeline';
import { useApiSearchPosts } from '../../../hooks/api/useApiSearch';
import { SEARCH_RESULT_TAB } from '../../../services/driver.service';
import { AppTimelineReducerActionType } from '../../../states/interactors/post-timeline.reducer';
import useLoadingMoreIndicatorState from '../../../states/useLoadingMoreIndicatorState';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { View } from 'react-native';
import { AppFlashList } from '../../../components/lib/AppFlashList';
import LoadingMore from '../../../components/screens/home/LoadingMore';
import Header from '../components/Header';

type ResultInteractorProps = {
	onDataLoaded: (isEmpty: boolean) => void;
};

function PostResultInteractor({ onDataLoaded }: ResultInteractorProps) {
	const [Refreshing, setRefreshing] = useState(false);
	const State = useDiscoverTabState();
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
		if (!data.success) {
			onDataLoaded(true);
			return;
		}
		onDataLoaded(false);
		TimelineDispatch({
			type: AppTimelineReducerActionType.APPEND_RESULTS,
			payload: {
				items: data.items,
				maxId: data.maxId,
			},
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
			<AppFlashList.Post
				data={TimelineState.items}
				onScroll={onScroll}
				refreshing={Refreshing}
				onRefresh={onRefresh}
				ListHeaderComponent={Header}
			/>
			<LoadingMore visible={visible} loading={loading} />
		</View>
	);
}

export default PostResultInteractor;
