import {
	PostTimelineCtx,
	PostTimelineStateAction,
	usePostTimelineDispatch,
	usePostTimelineState,
} from '@dhaaga/core';
import SimplePostTimeline from '#/components/timelines/SimplePostTimeline';
import useTimelineQueryReactNative from '#/hooks/useTimelineQueryReactNative';
import { useAppAcct, useAppDb } from '#/hooks/utility/global-state-extractors';
import { useEffect } from 'react';

function Content() {
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

	const queryResult = useTimelineQueryReactNative({
		type: State.feedType,
		query: State.query,
		opts: State.opts,
		maxId: State.appliedMaxId,
	});

	return (
		<SimplePostTimeline
			timelineLabel={'My Posts'}
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
