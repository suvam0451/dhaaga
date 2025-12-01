import { useLocalSearchParams } from 'expo-router';
import useScrollMoreOnPageEnd from '#/states/useScrollMoreOnPageEnd';
import {
	useAppAcct,
	useAppApiClient,
	useAppDb,
} from '#/hooks/utility/global-state-extractors';
import WithAutoHideTopNavBar from '#/components/containers/WithAutoHideTopNavBar';
import { PostTimelinePresenter } from '#/features/timelines/presenters/PostTimelinePresenter';
import { useEffect, useState } from 'react';
import {
	PostTimelineStateAction,
	PostTimelineCtx,
	usePostTimelineState,
	usePostTimelineDispatch,
} from '@dhaaga/core';
import { feedUnifiedQueryOptions } from '@dhaaga/react';
import { useQuery } from '@tanstack/react-query';

function DataView() {
	const [Refreshing, setRefreshing] = useState(false);
	const { db } = useAppDb();
	const { client, driver, server } = useAppApiClient();
	const { acct } = useAppAcct();

	const params = useLocalSearchParams();
	const id: string = params['uri'] as string;
	const label: string = params['displayName'] as string;

	// state management
	const State = usePostTimelineState();
	const dispatch = usePostTimelineDispatch();

	useEffect(() => {
		if (!db || !id) return;
		dispatch({
			type: PostTimelineStateAction.INIT,
			payload: {
				db,
			},
		});

		dispatch({
			type: PostTimelineStateAction.SETUP_CUSTOM_FEED_TIMELINE,
			payload: {
				uri: id,
				label: label,
			},
		});
	}, [db, id]);

	const { fetchStatus, data, status, refetch } = useQuery(
		feedUnifiedQueryOptions(client, driver, server, acct.identifier, {
			type: State.feedType,
			query: State.query,
			opts: State.opts,
			maxId: State.appliedMaxId,
		}),
	);

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
		loadNextPage: loadMore,
	});

	function onRefresh() {
		setRefreshing(true);
		dispatch({
			type: PostTimelineStateAction.RESET,
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
		<PostTimelineCtx>
			<DataView />
		</PostTimelineCtx>
	);
}

export default Page;
