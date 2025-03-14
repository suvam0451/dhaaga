import TimelinePostListView from '../view/TimelinePostListView';
import { useEffect, useRef, useState } from 'react';
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

	const [debouncedFetchStatus, setDebouncedFetchStatus] = useState(false);
	const timeoutRef = useRef(null);

	const debounceFn = (state: boolean) => {
		if (state === false && debouncedFetchStatus === true) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => {
				setDebouncedFetchStatus(false);
			}, 1000);
		} else {
			clearTimeout(timeoutRef.current);
			setDebouncedFetchStatus(true);
		}
	};

	useEffect(() => {
		debounceFn(fetchStatus === 'fetching');
		return () => clearTimeout(timeoutRef.current);
	}, [fetchStatus]);

	return (
		<TimelinePostListView
			items={State.items}
			numItems={State.items.length}
			onRefresh={onRefresh}
			refreshing={Refreshing}
			loadMore={loadMore}
			fetching={debouncedFetchStatus}
		/>
	);
}

export default TimelinePresenter;
