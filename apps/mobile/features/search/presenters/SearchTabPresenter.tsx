import { useEffect } from 'react';
import { DiscoverTabReducerActionType } from '../reducers/discover-tab.reducer';
import { useDiscoverTabDispatch } from '../contexts/DiscoverTabCtx';
import SearchResultPresenter from './SearchResultPresenter';

/**
 * Renders the results of a
 * search query in discover
 * tab
 */
function SearchTabPresenter() {
	const dispatch = useDiscoverTabDispatch();

	useEffect(() => {
		dispatch({
			type: DiscoverTabReducerActionType.CLEAR_SEARCH,
		});
	}, []);

	return <SearchResultPresenter refetch={async () => {}} />;
}

export default SearchTabPresenter;
