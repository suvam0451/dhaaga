import { useEffect, useState } from 'react';
import { useFeedTimelineDispatch, useFeedTimelineState } from '@dhaaga/core';
import { useApiSearchFeeds } from '../../../hooks/api/useApiSearch';
import { ACTION, FeedTimelineStateAction } from '@dhaaga/core';
import useLoadingMoreIndicatorState from '../../../states/useLoadingMoreIndicatorState';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { Animated, RefreshControl, View } from 'react-native';
import { TimelineLoadingIndicator } from '../../../ui/LoadingIndicator';
import Header from '../components/Header';
import FeedListItemView from '../../timelines/view/FeedListItemView';
import NoResults from '../../../components/error-screen/NoResults';
import { useDiscoverState } from '@dhaaga/core';

type FeedResultInteractorProps = {
	onDataLoaded: (isEmpty: boolean) => void;
};

function FeedResultInteractor({ onDataLoaded }: FeedResultInteractorProps) {
	const [Refreshing, setRefreshing] = useState(false);
	const State = useDiscoverState();
	const feedState = useFeedTimelineState();
	const dispatch = useFeedTimelineDispatch();
	const { data, fetchStatus, refetch, isFetched } = useApiSearchFeeds(
		State.q,
		feedState.appliedMaxId,
	);
	useEffect(() => {
		dispatch({
			type: ACTION.RESET,
		});
	}, [State.q]);

	async function refresh() {
		setRefreshing(true);
		dispatch({
			type: FeedTimelineStateAction.RESET,
		});
		refetch().finally(() => {
			setRefreshing(false);
		});
	}

	function loadMore() {
		dispatch({
			type: FeedTimelineStateAction.REQUEST_LOAD_MORE,
		});
	}

	useEffect(() => {
		if (!data) {
			onDataLoaded(true);
			return;
		}
		onDataLoaded(false);
		if (data.items.length === 0) return;

		dispatch({
			type: FeedTimelineStateAction.APPEND_RESULTS,
			payload: {
				items: data.items,
				maxId: data.maxId,
				minId: null,
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
		itemCount: feedState.items.length,
		updateQueryCache: loadMore,
	});

	if (isFetched && feedState.items.length === 0)
		return (
			<View>
				<Header />
				<NoResults text={'No results 🤔'} subtext={'Try a different keyword'} />
			</View>
		);

	return (
		<View style={{ flex: 1 }}>
			<Animated.FlatList
				data={feedState.items}
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
