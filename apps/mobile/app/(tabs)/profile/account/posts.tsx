import {
	PostTimelineCtx,
	PostTimelineStateAction,
	usePostTimelineDispatch,
	usePostTimelineState,
} from '@dhaaga/core';
import PostTimelineView from '#/components/timelines/PostTimelineView';
import useTimelineQueryReactNative from '#/hooks/useTimelineQueryReactNative';
import { useActiveUserSession, useAppDb } from '#/states/global/hooks';
import { useEffect } from 'react';

function Content() {
	const { db } = useAppDb();
	const { acct } = useActiveUserSession();

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

	const queryResult = useTimelineQueryReactNative({
		type: State.feedType,
		query: State.query,
		opts: State.opts,
		maxId: State.appliedMaxId,
	});

	return (
		<PostTimelineView
			label={'My Posts'}
			queryResult={queryResult}
			skipTimelineInit
		/>
	);
}
function Page() {
	return (
		<PostTimelineCtx>
			<Content />
		</PostTimelineCtx>
	);
}

export default Page;
