import { useEffect, useState } from 'react';
import useTimelineQuery from './useTimelineQuery';
import {
	PostTimelineStateAction,
	TimelineFetchMode,
	usePostTimelineDispatch,
	usePostTimelineState,
} from '@dhaaga/core';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { useAppDb } from '../../../hooks/utility/global-state-extractors';

function useTimeline(mode: TimelineFetchMode) {
	const [Refreshing, IsRefreshing] = useState(false);
	const { db } = useAppDb();

	// state management
	const State = usePostTimelineState();
	const dispatch = usePostTimelineDispatch();

	useEffect(() => {
		if (!db) return;
		dispatch({
			type: PostTimelineStateAction.INIT,
			payload: {
				db,
			},
		});
	}, [db]);

	useEffect(() => {
		dispatch({
			type: PostTimelineStateAction.RESET_USING_QUERY,
			payload: {
				type: mode,
			},
		});
	}, [mode]);

	const { fetchStatus, data, status, refetch } = useTimelineQuery({
		type: State.feedType,
		query: State.query,
		opts: State.opts,
		maxId: State.appliedMaxId,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		dispatch({
			type: PostTimelineStateAction.APPEND_RESULTS,
			payload: data,
		});
	}, [fetchStatus]);

	function loadMore() {
		dispatch({
			type: PostTimelineStateAction.REQUEST_LOAD_MORE,
		});
	}

	/**
	 * Composite Hook Collection
	 */
	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: State.items.length,
		updateQueryCache: loadMore,
	});

	function onRefresh() {
		IsRefreshing(true);
		dispatch({
			type: PostTimelineStateAction.RESET,
		});
		refetch().finally(() => {
			IsRefreshing(false);
		});
	}

	return {
		refreshing: Refreshing,
		refresh: onRefresh,
		data: State.items,
		onScroll,
		translateY,
		fetchStatus,
	};
}

export default useTimeline;
