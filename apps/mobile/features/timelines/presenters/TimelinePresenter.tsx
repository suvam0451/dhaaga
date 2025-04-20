import TimelinePostListView from '../view/TimelinePostListView';
import { useState } from 'react';
import {
	PostTimelineStateAction,
	usePostTimelineState,
	usePostTimelineDispatch,
} from '@dhaaga/core';
import { FetchStatus, RefetchOptions } from '@tanstack/react-query';

type TimelinePresenterProps = {
	refetch: (options?: RefetchOptions) => Promise<any>;
	fetchStatus: FetchStatus;
};

function TimelinePresenter({ refetch, fetchStatus }: TimelinePresenterProps) {
	const [Refreshing, setRefreshing] = useState(false);
	const State = usePostTimelineState();
	const dispatch = usePostTimelineDispatch();

	function onRefresh() {
		setRefreshing(true);
		dispatch({
			type: PostTimelineStateAction.RESET,
		});
		refetch().finally(() => {
			setRefreshing(false);
		});
		setRefreshing(false);
	}

	function loadMore() {
		dispatch({
			type: PostTimelineStateAction.REQUEST_LOAD_MORE,
		});
	}

	return (
		<TimelinePostListView
			items={State.items}
			numItems={State.items.length}
			onRefresh={onRefresh}
			refreshing={Refreshing}
			loadMore={loadMore}
			fetching={fetchStatus === 'fetching' || State.isFetching}
		/>
	);
}

export default TimelinePresenter;
