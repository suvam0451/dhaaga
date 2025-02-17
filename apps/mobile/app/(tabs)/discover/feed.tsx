import { useLocalSearchParams } from 'expo-router';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { useAppDb } from '../../../hooks/utility/global-state-extractors';
import WithAutoHideTopNavBar from '../../../components/containers/WithAutoHideTopNavBar';
import { PostTimelinePresenter } from '../../../features/timelines/presenters/PostTimelinePresenter';
import WithPostTimelineCtx, {
	useTimelineDispatch,
	useTimelineState,
} from '../../../features/timelines/contexts/PostTimelineCtx';
import { useEffect, useState } from 'react';
import { AppTimelineReducerActionType } from '../../../states/interactors/post-timeline.reducer';
import useTimelineQuery from '../../../features/timelines/api/useTimelineQuery';

function DataView() {
	const [Refreshing, setRefreshing] = useState(false);
	const { db } = useAppDb();

	const params = useLocalSearchParams();
	const id: string = params['uri'] as string;
	const label: string = params['displayName'] as string;

	// state management
	const State = useTimelineState();
	const dispatch = useTimelineDispatch();

	useEffect(() => {
		if (!db || !id) return;
		dispatch({
			type: AppTimelineReducerActionType.INIT,
			payload: {
				db,
			},
		});

		dispatch({
			type: AppTimelineReducerActionType.SETUP_CUSTOM_FEED_TIMELINE,
			payload: {
				uri: id,
				label: label,
			},
		});
	}, [db, id]);

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
		setRefreshing(true);
		dispatch({
			type: AppTimelineReducerActionType.RESET,
		});
		refetch().finally(() => {
			setRefreshing(false);
		});
	}

	return (
		<WithAutoHideTopNavBar title={'Feed'} translateY={translateY}>
			<PostTimelinePresenter
				data={State.items}
				onScroll={onScroll}
				refreshing={Refreshing}
				onRefresh={onRefresh}
				fetchStatus={fetchStatus}
			/>
		</WithAutoHideTopNavBar>
	);
}

/**
 * Feed preview page
 * @constructor
 */
function Page() {
	return (
		<WithPostTimelineCtx>
			<DataView />
		</WithPostTimelineCtx>
	);
}

export default Page;
