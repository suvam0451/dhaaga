import { useEffect } from 'react';
import { useDiscoverDispatch, DiscoverStateAction } from '@dhaaga/core';
import SearchResultPresenter from './SearchResultPresenter';

/**
 * Renders the results of a
 * search query in discover
 * tab
 */
function SearchTabPresenter() {
	const dispatch = useDiscoverDispatch();

	useEffect(() => {
		dispatch({
			type: DiscoverStateAction.CLEAR_SEARCH,
		});
	}, []);

	return <SearchResultPresenter refetch={async () => {}} />;
}

export default SearchTabPresenter;
