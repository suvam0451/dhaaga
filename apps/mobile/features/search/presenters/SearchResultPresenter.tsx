import WithFeedTimelineCtx from '../../timelines/contexts/FeedTimelineCtx';
import { RefetchOptions } from '@tanstack/react-query';
import {
	APP_SEARCH_TYPE,
	DiscoverTabReducerActionType,
} from '../reducers/discover-tab.reducer';
import WithPostTimelineCtx from '../../timelines/contexts/PostTimelineCtx';
import WithUserTimelineCtx from '../../timelines/contexts/UserTimelineCtx';
import {
	useDiscoverTabDispatch,
	useDiscoverTabState,
} from '../contexts/DiscoverTabCtx';
import FeedResultInteractor from '../interactors/FeedResultInteractor';
import Header from '../components/Header';
import PostResultInteractor from '../interactors/PostResultInteractor';
import UserResultInteractor from '../interactors/UserResultInteractor';
import LandingPageView from '../views/LandingPageView';

type FeedSearchResultPresenterProps = {
	refetch: (options?: RefetchOptions) => Promise<void>;
};

function SearchResultPresenter({ refetch }: FeedSearchResultPresenterProps) {
	const State = useDiscoverTabState();
	const DiscoverTabDispatch = useDiscoverTabDispatch();

	function onDataLoaded(isEmpty: boolean) {
		DiscoverTabDispatch({
			type: DiscoverTabReducerActionType.MARK_LOADING_DONE,
		});
	}

	if (!State.q) return <LandingPageView />;

	switch (State.category) {
		case APP_SEARCH_TYPE.POSTS:
			return (
				<WithPostTimelineCtx>
					<PostResultInteractor onDataLoaded={onDataLoaded} />
				</WithPostTimelineCtx>
			);
		case APP_SEARCH_TYPE.USERS:
			return (
				<WithUserTimelineCtx>
					<UserResultInteractor onDataLoaded={onDataLoaded} />
				</WithUserTimelineCtx>
			);
		case APP_SEARCH_TYPE.FEEDS:
			return (
				<WithFeedTimelineCtx>
					<FeedResultInteractor onDataLoaded={onDataLoaded} />
				</WithFeedTimelineCtx>
			);

		default:
			return <Header />;
	}
}

export default SearchResultPresenter;
