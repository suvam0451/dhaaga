import { SEARCH_RESULT_TAB } from '#/services/driver.service';
import {
	PostTimelineCtx,
	useDiscoverState,
	usePostTimelineState,
} from '@dhaaga/core';
import { searchPostsQueryOpts } from '@dhaaga/react';
import { useQuery } from '@tanstack/react-query';
import { useAppApiClient } from '#/states/global/hooks';
import PostTimelineView from '#/components/timelines/PostTimelineView';

function Generator() {
	const { client, driver, server } = useAppApiClient();
	const State = useDiscoverState();
	const TimelineState = usePostTimelineState();
	const queryResult = useQuery(
		searchPostsQueryOpts(
			client,
			driver,
			server,
			State.q,
			TimelineState.appliedMaxId,
			State.tab === SEARCH_RESULT_TAB.LATEST ? 'latest' : 'top',
		),
	);

	return (
		<>
			<PostTimelineView
				label={null}
				queryResult={queryResult}
				navbarType={'explore'}
				flatListKey={'explore/posts'}
			/>
		</>
	);
}

function PostResultView() {
	return (
		<PostTimelineCtx>
			<Generator />
		</PostTimelineCtx>
	);
}

export default PostResultView;
