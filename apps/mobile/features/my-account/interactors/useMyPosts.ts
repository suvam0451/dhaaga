import {
	useAppAcct,
	useAppDb,
} from '../../../hooks/utility/global-state-extractors';
import { useEffect } from 'react';
import {
	PostTimelineStateAction,
	usePostTimelineDispatch,
	usePostTimelineState,
} from '@dhaaga/core';
import useTimelineQueryReactNative from '#/hooks/useTimelineQueryReactNative';

function useMyPosts() {
	const { db } = useAppDb();
	const { acct } = useAppAcct();

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

		dispatch({
			type: PostTimelineStateAction.SETUP_USER_POST_TIMELINE,
			payload: {
				id: acct?.identifier,
				label: acct?.displayName || acct?.username,
			},
		});
	}, [db]);

	const { fetchStatus, data, status, refetch } = useTimelineQueryReactNative({
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

	async function onRefresh() {
		dispatch({
			type: PostTimelineStateAction.RESET,
		});
		await refetch();
	}

	return { loadMore, onRefresh, fetchStatus };
}

export default useMyPosts;
