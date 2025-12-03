import { forwardRef, useEffect, useImperativeHandle } from 'react';
import {
	useDiscoverDispatch,
	DiscoverStateAction,
	useDiscoverState,
} from '@dhaaga/core';
import SearchResultPresenter from './SearchResultPresenter';
import { getSearchTabs } from '@dhaaga/db';
import { useAppApiClient } from '#/hooks/utility/global-state-extractors';

/**
 * Renders the results of a
 * search query in the discovery tab
 */
const SearchTabPresenter = forwardRef((props, ref) => {
	const { driver } = useAppApiClient();
	const State = useDiscoverState();
	const dispatch = useDiscoverDispatch();

	useImperativeHandle(ref, () => ({
		onSearch(searchTerm: string) {
			dispatch({
				type: DiscoverStateAction.SET_SEARCH,
				payload: {
					q: searchTerm,
				},
			});
			dispatch({
				type: DiscoverStateAction.APPLY_SEARCH,
			});
		},
	}));

	useEffect(() => {
		dispatch({
			type: DiscoverStateAction.CLEAR_SEARCH,
		});
	}, []);

	/**
	 * Set the default search tab for the
	 * given software driver
	 */
	useEffect(() => {
		const searchTabs = getSearchTabs(driver);

		dispatch({
			type: DiscoverStateAction.SET_CATEGORY,
			payload: {
				tab: searchTabs.find((o) => o === State.tab)
					? searchTabs.find((o) => o === State.tab)
					: searchTabs[0],
			},
		});
	}, [driver]);

	return <SearchResultPresenter refetch={async () => {}} />;
});

export default SearchTabPresenter;
