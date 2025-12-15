import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import {
	DiscoverCtx,
	DiscoverStateAction,
	useDiscoverDispatch,
	useDiscoverState,
} from '@dhaaga/core';
import {
	useActiveUserSession,
	useAppActiveSession,
	useAppApiClient,
	useAppTheme,
} from '#/states/global/hooks';
import { getSearchTabs } from '@dhaaga/db';
import SearchResultView from '#/features/explore/SearchResultView';
import ExploreTabNavBar from '#/features/explore/ExploreTabNavBar';
import ZenExplorationWidget from '#/features/explore/components/ZenExplorationWidget';

/**
 * Renders the results of a
 * search query in the discovery tab
 */
function Content() {
	const { driver } = useAppApiClient();
	const State = useDiscoverState();
	const dispatch = useDiscoverDispatch();

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

	return (
		<>
			<ExploreTabNavBar />
			<SearchResultView />
			<ZenExplorationWidget />
		</>
	);
}

function Page() {
	const { theme } = useAppTheme();
	const { acct } = useActiveUserSession();
	const { session } = useAppActiveSession();

	if (!acct || session.state !== 'valid') return <Redirect href={'/'} />;

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.palette.bg,
			}}
		>
			<DiscoverCtx>
				<Content />
			</DiscoverCtx>
		</View>
	);
}

export default Page;
