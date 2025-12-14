import { useLocalSearchParams } from 'expo-router';
import {
	useActiveUserSession,
	useAppApiClient,
	useAppDb,
} from '#/states/global/hooks';
import { useEffect } from 'react';
import {
	PostTimelineStateAction,
	PostTimelineCtx,
	usePostTimelineState,
	usePostTimelineDispatch,
} from '@dhaaga/core';
import { unifiedPostFeedQueryOptions } from '@dhaaga/react';
import { useQuery } from '@tanstack/react-query';
import PostTimelineView from '#/components/timelines/PostTimelineView';

function DataView() {
	const { db } = useAppDb();
	const { client, driver, server } = useAppApiClient();
	const { acct } = useActiveUserSession();

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

	const queryResult = useQuery(
		unifiedPostFeedQueryOptions(client, driver, server, acct?.identifier, {
			type: State.feedType,
			query: State.query,
			opts: State.opts,
			maxId: State.appliedMaxId,
		}),
	);

	return (
		<PostTimelineView
			label={State?.query?.label ?? 'Custom Feed'}
			queryResult={queryResult}
			skipTimelineInit
			navbarType={'unified'}
			flatListKey={'unified-feed'}
		/>
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
