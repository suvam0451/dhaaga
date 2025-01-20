import TimelinePostListView from '../view/TimelinePostListView';
import {
	useTimelineDispatch,
	useTimelineState,
} from '../contexts/PostTimelineCtx';
import { useState } from 'react';
import { AppTimelineReducerActionType } from '../../../states/interactors/post-timeline.reducer';
import { FetchStatus, RefetchOptions } from '@tanstack/react-query';

type TimelinePresenterProps = {
	refetch: (options?: RefetchOptions) => Promise<any>;
	fetchStatus: FetchStatus;
};

function TimelinePresenter({ refetch, fetchStatus }: TimelinePresenterProps) {
	const [Refreshing, setRefreshing] = useState(false);
	const State = useTimelineState();
	const dispatch = useTimelineDispatch();

	function onRefresh() {
		setRefreshing(true);
		dispatch({
			type: AppTimelineReducerActionType.RESET,
		});
		refetch().finally(() => {
			setRefreshing(false);
		});
		setRefreshing(false);
	}

	function loadMore() {
		dispatch({
			type: AppTimelineReducerActionType.REQUEST_LOAD_MORE,
		});
	}

	return (
		<TimelinePostListView
			items={State.items}
			numItems={State.items.length}
			onRefresh={onRefresh}
			refreshing={Refreshing}
			loadMore={loadMore}
			fetchStatus={fetchStatus}
		/>
	);
}

export default TimelinePresenter;
