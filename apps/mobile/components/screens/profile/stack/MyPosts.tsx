import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import useTimeline from '../../../common/timeline/api/useTimeline';
import { useEffect, useState } from 'react';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../shared/topnavbar/AppTopNavbar';
import { AppTimelineReducerActionType } from '../../../../states/reducers/post-timeline.reducer';
import WithPostTimelineCtx, {
	useTimelineDispatch,
	useTimelineState,
} from '../../../context-wrappers/WithPostTimeline';
import {
	useAppAcct,
	useAppDb,
} from '../../../../hooks/utility/global-state-extractors';
import { PostTimeline } from '../../../data-views/PostTimeline';

function DataView() {
	const { db } = useAppDb();
	const { acct } = useAppAcct();

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
			type: AppTimelineReducerActionType.SETUP_USER_POST_TIMELINE,
			payload: {
				id: acct?.identifier,
				label: acct?.displayName || acct?.username,
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
		<AppTopNavbar
			title={'My Posts'}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<PostTimeline
				data={State.items}
				onScroll={onScroll}
				refreshing={Refreshing}
				onRefresh={onRefresh}
				fetchStatus={fetchStatus}
			/>
		</AppTopNavbar>
	);
}

function MyPosts() {
	return (
		<WithPostTimelineCtx>
			<DataView />
		</WithPostTimelineCtx>
	);
}

export default MyPosts;
