import { useEffect, useState } from 'react';
import {
	useFeedTimelineDispatch,
	useFeedTimelineState,
} from '../../timelines/contexts/FeedTimelineCtx';
import { useApiSearchFeeds } from '../../../hooks/api/useApiSearch';
import {
	ACTION,
	AppFeedTimelineReducerActionType,
} from '../../../states/interactors/feed-timeline.reducer';
import useLoadingMoreIndicatorState from '../../../states/useLoadingMoreIndicatorState';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { Animated, RefreshControl, View } from 'react-native';
import { TimelineLoadingIndicator } from '../../../ui/LoadingIndicator';
import Header from '../components/Header';
import { AppUserTimelineReducerActionType } from '../../../states/interactors/user-timeline.reducer';
import FeedListItemView from '../../timelines/view/FeedListItemView';
import NoResults from '../../../components/error-screen/NoResults';
import { useDiscoverState } from '@dhaaga/core';

type FeedResultInteractorProps = {
	onDataLoaded: (isEmpty: boolean) => void;
};

function FeedResultInteractor({ onDataLoaded }: FeedResultInteractorProps) {
	const [Refreshing, setRefreshing] = useState(false);
	const State = useDiscoverState();
	const TimelineState = useFeedTimelineState();
	const TimelineDispatch = useFeedTimelineDispatch();
	const { data, fetchStatus, refetch, isFetched } = useApiSearchFeeds(
		State.q,
		TimelineState.appliedMaxId,
	);
	useEffect(() => {
		TimelineDispatch({
			type: ACTION.RESET,
		});
	}, [State.q]);

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

	if (isFetched && TimelineState.items.length === 0)
		return (
			<View>
				<Header />
				<NoResults text={'No results 🤔'} subtext={'Try a different keyword'} />
			</View>
		);

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
			<TimelineLoadingIndicator visible={visible} loading={loading} />
		</View>
	);
}

export default FeedResultInteractor;
