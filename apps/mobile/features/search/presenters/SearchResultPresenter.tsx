import { RefetchOptions } from '@tanstack/react-query';
import {
	useDiscoverDispatch,
	useDiscoverState,
	DiscoverStateAction,
	PostTimelineCtx,
	UserTimelineCtx,
	FeedTimelineCtx,
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
				<PostTimelineCtx>
					<PostResultInteractor onDataLoaded={onDataLoaded} />
				</PostTimelineCtx>
			);
		case 'users':
			return (
				<UserTimelineCtx>
					<UserResultInteractor onDataLoaded={onDataLoaded} />
				</UserTimelineCtx>
			);
		case 'feeds':
			return (
				<FeedTimelineCtx>
					<FeedResultInteractor onDataLoaded={onDataLoaded} />
				</FeedTimelineCtx>
			);

		default:
			return <Header />;
	}
}

export default SearchResultPresenter;
