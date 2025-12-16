import {
	FeedTimelineCtx,
	useFeedTimelineState,
	useDiscoverState,
} from '@dhaaga/core';
import { useApiSearchFeeds } from '#/hooks/api/useApiSearch';
import FeedTimelineView from '#/components/timelines/FeedTimelineView';

function Generator() {
	const State = useDiscoverState();
	const feedState = useFeedTimelineState();
	const queryResult = useApiSearchFeeds(State.q, feedState.appliedMaxId);

	return (
		<FeedTimelineView
			label={'N/A'}
			queryResult={queryResult}
			navbarType={'explore'}
			flatListKey={'explore/feeds'}
		/>
	);
}

function FeedResultView() {
	return (
		<FeedTimelineCtx>
			<Generator />
		</FeedTimelineCtx>
	);
}

export default FeedResultView;
