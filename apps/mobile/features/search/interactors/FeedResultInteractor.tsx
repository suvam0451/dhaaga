import { useEffect, useState } from 'react';
import { useDiscoverTabState } from '../contexts/DiscoverTabCtx';
import {
	useFeedTimelineDispatch,
	useFeedTimelineState,
} from '../../timelines/contexts/FeedTimelineCtx';
import { useApiSearchFeeds } from '../../../hooks/api/useApiSearch';
import { AppFeedTimelineReducerActionType } from '../../../states/interactors/feed-timeline.reducer';
import useLoadingMoreIndicatorState from '../../../states/useLoadingMoreIndicatorState';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { Animated, RefreshControl, View } from 'react-native';
import LoadingMore from '../../../components/screens/home/LoadingMore';
import Header from '../components/Header';
import { AppUserTimelineReducerActionType } from '../../../states/interactors/user-timeline.reducer';
import FeedListItemView from '../../timelines/view/FeedListItemView';

type FeedResultInteractorProps = {
	onDataLoaded: (isEmpty: boolean) => void;
};

function FeedResultInteractor({ onDataLoaded }: FeedResultInteractorProps) {
	const [Refreshing, setRefreshing] = useState(false);
	const State = useDiscoverTabState();
	const TimelineState = useFeedTimelineState();
	const TimelineDispatch = useFeedTimelineDispatch();
	const { data, fetchStatus, refetch } = useApiSearchFeeds(
		State.q,
		TimelineState.appliedMaxId,
	);

	async function refresh() {
		setRefreshing(true);
		TimelineDispatch({
			type: AppUserTimelineReducerActionType.RESET,
		});
		refetch().finally(() => {
			setRefreshing(false);
		});
	}

	function loadMore() {
		TimelineDispatch({
			type: AppUserTimelineReducerActionType.REQUEST_LOAD_MORE,
		});
	}

	useEffect(() => {
		if (!data) {
			onDataLoaded(true);
			return;
		}
		onDataLoaded(false);
		if (data.items.length === 0) return;

		TimelineDispatch({
			type: AppFeedTimelineReducerActionType.APPEND_RESULTS,
			payload: {
				items: data.items,
				maxId: data.maxId,
			},
		});
	}, [fetchStatus]);

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

	if (TimelineState.items.length === 0) return <View />;

	return (
		<View style={{ flex: 1 }}>
			<Animated.FlatList
				data={TimelineState.items}
				renderItem={({ item }) => <FeedListItemView item={item} />}
				onScroll={onScroll}
				ListHeaderComponent={Header}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl refreshing={Refreshing} onRefresh={refresh} />
				}
			/>
			<LoadingMore visible={visible} loading={loading} />
		</View>
	);
}

export default FeedResultInteractor;
