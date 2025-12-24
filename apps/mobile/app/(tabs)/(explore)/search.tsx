import { View } from 'react-native';
import { useEffect, useMemo } from 'react';
import {
	DiscoverCtx,
	DiscoverStateAction,
	useDiscoverDispatch,
	useDiscoverState,
} from '@dhaaga/core';
import { useAppApiClient } from '#/states/global/hooks';
import { getSearchTabs } from '@dhaaga/db';
import ZenExplorationWidget from '#/features/explore/components/ZenExplorationWidget';
import ZenModeAnimations from '#/features/explore/components/ZenModeAnimations';
import PostResultView from '#/features/explore/views/PostResultView';
import UserResultView from '#/features/explore/views/UserResultView';
import FeedResultView from '#/features/explore/views/FeedResultView';
import WithBackgroundSkin from '#/components/containers/WithBackgroundSkin';

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

	const CurrentResultView = useMemo(() => {
		if (!State.q) return <ZenModeAnimations />;

		switch (State.category) {
			case 'posts':
				return <PostResultView />;
			case 'users':
				return <UserResultView />;
			case 'feeds':
				return <FeedResultView />;
			case 'tags':
				return <View />;
			case 'links':
				return <View />;
			default:
				return <ZenModeAnimations />;
		}
	}, [State.category, State.q]);

	return (
		<>
			{CurrentResultView}
			<ZenExplorationWidget />
		</>
	);
}

function Page() {
	return (
		<WithBackgroundSkin>
			<DiscoverCtx>
				<Content />
			</DiscoverCtx>
		</WithBackgroundSkin>
	);
}

export default Page;
