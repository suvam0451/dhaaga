import { useEffect, useState } from 'react';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { useAppDb } from '../../../../hooks/utility/global-state-extractors';
import WithPostTimelineCtx, {
	useTimelineDispatch,
	useTimelineState,
} from '../../../context-wrappers/WithPostTimeline';
import {
	AppTimelineReducerActionType,
	TimelineFetchMode,
} from '../../../../states/reducers/post-timeline.reducer';
import useTimeline from '../../../common/timeline/api/useTimeline';
import { PostTimeline } from '../../../data-views/PostTimeline';

function DataView() {
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

		dispatch({
			type: AppTimelineReducerActionType.RESET_USING_QUERY,
			payload: {
				type: TimelineFetchMode.BOOKMARKS,
			},
		});
	}, [db]);

	const { fetchStatus, data, status, refetch } = useTimeline({
		type: State.feedType,
		query: State.query,
		opts: State.opts,
		maxId: State.appliedMaxId,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		dispatch({
			type: AppTimelineReducerActionType.APPEND_RESULTS,
			payload: {
				items: data.data,
				maxId: data.maxId,
			},
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

	const [Refreshing, setRefreshing] = useState(false);

	function onRefresh() {
		setRefreshing(true);
		dispatch({
			type: AppTimelineReducerActionType.RESET,
		});
		refetch().finally(() => {
			setRefreshing(false);
		});
	}

	return (
		<WithAutoHideTopNavBar title={'My Bookmarks'} translateY={translateY}>
			<PostTimeline
				data={State.items}
				onScroll={onScroll}
				refreshing={Refreshing}
				onRefresh={onRefresh}
				fetchStatus={fetchStatus}
			/>
		</WithAutoHideTopNavBar>
	);
}

function MyBookmark() {
	return (
		<WithPostTimelineCtx>
			<DataView />
		</WithPostTimelineCtx>
	);
}

export default MyBookmark;
