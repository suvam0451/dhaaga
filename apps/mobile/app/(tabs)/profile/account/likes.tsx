import {
	PostTimelineCtx,
	TimelineFetchMode,
	usePostTimelineState,
} from '@dhaaga/core';
import {
	useAppAcct,
	useAppApiClient,
} from '#/hooks/utility/global-state-extractors';
import { unifiedPostFeedQueryOptions } from '@dhaaga/react';
import SimplePostTimeline from '#/components/timelines/SimplePostTimeline';
import { useQuery } from '@tanstack/react-query';

function ContentView() {
	const { client, driver, server } = useAppApiClient();
	const { acct } = useAppAcct();

	const State = usePostTimelineState()!;

	const queryResult = useQuery(
		unifiedPostFeedQueryOptions(client, driver, server, acct?.identifier, {
			type: TimelineFetchMode.LIKES,
			maxId: State.appliedMaxId,
			sessionId: State.sessionId,
		}),
	);

	return (
		<SimplePostTimeline timelineLabel={'My Likes'} queryResult={queryResult} />
	);
}

function Page() {
	return (
		<PostTimelineCtx>
			<ContentView />
		</PostTimelineCtx>
	);
}

export default Page;
