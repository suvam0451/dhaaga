import {
	PostTimelineCtx,
	TimelineFetchMode,
	usePostTimelineState,
} from '@dhaaga/core';
import { useActiveUserSession, useAppApiClient } from '#/states/global/hooks';
import { unifiedPostFeedQueryOptions } from '@dhaaga/react';
import PostTimelineView from '#/components/timelines/PostTimelineView';
import { useQuery } from '@tanstack/react-query';

function ContentView() {
	const { client, driver, server } = useAppApiClient();
	const { acct } = useActiveUserSession();

	const State = usePostTimelineState()!;

	const queryResult = useQuery(
		unifiedPostFeedQueryOptions(client, driver, server, acct?.identifier, {
			type: TimelineFetchMode.LIKES,
			maxId: State.appliedMaxId,
			sessionId: State.sessionId,
		}),
	);

	return <PostTimelineView label={'My Likes'} queryResult={queryResult} />;
}

function Page() {
	return (
		<PostTimelineCtx>
			<ContentView />
		</PostTimelineCtx>
	);
}

export default Page;
