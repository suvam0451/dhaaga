import { useEffect, useState } from 'react';
import {
	useTimelineDispatch,
	useTimelineState,
} from '../contexts/PostTimelineCtx';
import useTimelineQuery from './useTimelineQuery';
import {
	AppTimelineReducerActionType,
	TimelineFetchMode,
} from '../../../states/interactors/post-timeline.reducer';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { useAppDb } from '../../../hooks/utility/global-state-extractors';

function useTimeline(mode: TimelineFetchMode) {
	const [Refreshing, IsRefreshing] = useState(false);
	const { db } = useAppDb();

	// state management
	const State = useTimelineState();
	const dispatch = useTimelineDispatch();

	useEffect(() => {
		if (!db) return;
		dispatch({
			type: AppTimelineReducerActionType.INIT,
			payload: {
				db,
			},
		});
	}, [db]);

	useEffect(() => {
		dispatch({
			type: AppTimelineReducerActionType.RESET_USING_QUERY,
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
			type: AppTimelineReducerActionType.APPEND_RESULTS,
			payload: data,
		});
	}, [fetchStatus]);

	function loadMore() {
		dispatch({
			type: AppTimelineReducerActionType.REQUEST_LOAD_MORE,
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
			type: AppTimelineReducerActionType.RESET,
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
