import {
	PostTimelineCtx,
	TimelineFetchMode,
	usePostTimelineState,
} from '@dhaaga/core';
import { unifiedPostFeedQueryOptions } from '@dhaaga/react';
import { useActiveUserSession, useAppApiClient } from '#/states/global/hooks';
import { useQuery } from '@tanstack/react-query';
import SimplePostTimeline from '#/components/timelines/SimplePostTimeline';

function PageContent() {
	const { client, driver, server } = useAppApiClient();
	const { acct } = useActiveUserSession();

	const State = usePostTimelineState()!;

	const queryResult = useQuery(
		unifiedPostFeedQueryOptions(client, driver, server, acct?.identifier, {
			type: TimelineFetchMode.BOOKMARKS,
			maxId: State.appliedMaxId,
			sessionId: State.sessionId,
		}),
	);

	return (
		<SimplePostTimeline
			timelineLabel={'My Bookmarks'}
			queryResult={queryResult}
		/>
	);
}

function Page() {
	return (
		<PostTimelineCtx>
			<PageContent />
		</PostTimelineCtx>
	);
}

export default Page;
