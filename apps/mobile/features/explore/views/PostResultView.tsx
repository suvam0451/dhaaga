import { SEARCH_RESULT_TAB } from '#/services/driver.service';
import {
	PostTimelineCtx,
	useDiscoverState,
	usePostTimelineState,
} from '@dhaaga/core';
import PostTimelineView from '#/components/timelines/PostTimelineView';
import { useApiSearchPosts } from '#/hooks/api/useApiSearch';

function Generator() {
	const State = useDiscoverState();
	const TimelineState = usePostTimelineState();
	const queryResult = useApiSearchPosts(
		State.q,
		TimelineState.appliedMaxId,
		State.tab === SEARCH_RESULT_TAB.LATEST ? 'latest' : 'top',
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
