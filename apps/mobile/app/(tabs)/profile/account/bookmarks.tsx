import {
	PostTimelineCtx,
	TimelineFetchMode,
	usePostTimelineState,
} from '@dhaaga/core';
import { unifiedPostFeedQueryOptions } from '@dhaaga/react';
import { useActiveUserSession, useAppApiClient } from '#/states/global/hooks';
import { useQuery } from '@tanstack/react-query';
import PostTimelineView from '#/components/timelines/PostTimelineView';

function Generator() {
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
		<PostTimelineView
			navbarType={'simple'}
			label={'My Bookmarks'}
			queryResult={queryResult}
			flatListKey={'account/bookmarks'}
		/>
	);
}

function Page() {
	return (
		<PostTimelineCtx>
			<Generator />
		</PostTimelineCtx>
	);
}

export default Page;
