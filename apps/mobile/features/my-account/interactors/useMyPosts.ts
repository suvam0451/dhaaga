import {
	useAppAcct,
	useAppDb,
} from '../../../hooks/utility/global-state-extractors';
import {
	useTimelineDispatch,
	useTimelineState,
} from '../../timelines/contexts/PostTimelineCtx';
import { useEffect } from 'react';
import { AppTimelineReducerActionType } from '../../../states/interactors/post-timeline.reducer';
import useTimelineQuery from '../../timelines/api/useTimelineQuery';

function useMyPosts() {
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

	async function onRefresh() {
		dispatch({
			type: AppTimelineReducerActionType.RESET,
		});
		await refetch();
	}

	return { loadMore, onRefresh, fetchStatus };
}

export default useMyPosts;
