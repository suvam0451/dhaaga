import { useEffect, useState } from 'react';
import {
	FeedTimelineCtx,
	useFeedTimelineDispatch,
	useFeedTimelineState,
} from '@dhaaga/core';
import { useApiSearchFeeds } from '#/hooks/api/useApiSearch';
import { ACTION, FeedTimelineStateAction } from '@dhaaga/core';
import { FlatList, RefreshControl, View } from 'react-native';
import { TimelineLoadingIndicator } from '#/ui/LoadingIndicator';
import FeedListItemView from '../../timelines/view/FeedListItemView';
import NoResults from '#/components/error-screen/NoResults';
import { useDiscoverState } from '@dhaaga/core';

function Generator() {
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
		if (!data) return;
		if (data.data.length === 0) return;

		dispatch({
			type: FeedTimelineStateAction.APPEND_RESULTS,
			payload: data,
		});
	}, [fetchStatus]);

	if (isFetched && feedState.items.length === 0)
		return (
			<View>
				<NoResults text={'No results 🤔'} subtext={'Try a different keyword'} />
			</View>
		);

	return (
		<View style={{ flex: 1 }}>
			<FlatList
				data={feedState.items}
				renderItem={({ item }) => <FeedListItemView item={item} />}
				refreshControl={
					<RefreshControl refreshing={Refreshing} onRefresh={refresh} />
				}
			/>
			<TimelineLoadingIndicator numItems={0} networkFetchStatus={fetchStatus} />
		</View>
	);
}

function FeedResultView() {
	return (
		<FeedTimelineCtx>
			<Generator />
		</FeedTimelineCtx>
	);
}

export default FeedResultView;
