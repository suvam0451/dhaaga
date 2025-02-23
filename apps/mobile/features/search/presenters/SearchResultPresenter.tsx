import WithFeedTimelineCtx from '../../timelines/contexts/FeedTimelineCtx';
import { RefetchOptions } from '@tanstack/react-query';
import WithPostTimelineCtx from '../../timelines/contexts/PostTimelineCtx';
import WithUserTimelineCtx from '../../timelines/contexts/UserTimelineCtx';
import {
	useDiscoverDispatch,
	useDiscoverState,
	DiscoverStateAction,
} from '@dhaaga/core';
import FeedResultInteractor from '../interactors/FeedResultInteractor';
import Header from '../components/Header';
import PostResultInteractor from '../interactors/PostResultInteractor';
import UserResultInteractor from '../interactors/UserResultInteractor';
import LandingPageView from '../views/LandingPageView';

type FeedSearchResultPresenterProps = {
	refetch: (options?: RefetchOptions) => Promise<void>;
};

function SearchResultPresenter({ refetch }: FeedSearchResultPresenterProps) {
	const State = useDiscoverState();
	const DiscoverTabDispatch = useDiscoverDispatch();

	function onDataLoaded(isEmpty: boolean) {
		DiscoverTabDispatch({
			type: DiscoverStateAction.MARK_LOADING_DONE,
		});
	}

	if (!State.q) return <LandingPageView />;

	switch (State.category) {
		case 'posts':
			return (
				<WithPostTimelineCtx>
					<PostResultInteractor onDataLoaded={onDataLoaded} />
				</WithPostTimelineCtx>
			);
		case 'users':
			return (
				<WithUserTimelineCtx>
					<UserResultInteractor onDataLoaded={onDataLoaded} />
				</WithUserTimelineCtx>
			);
		case 'feeds':
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
