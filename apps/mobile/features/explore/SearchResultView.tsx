import { useDiscoverState } from '@dhaaga/core';
import FeedResultView from '#/features/explore/views/FeedResultView';
import PostResultView from '#/features/explore/views/PostResultView';
import UserResultView from '#/features/explore/views/UserResultView';
import LandingPage from './components/LandingPage';
import { View } from 'react-native';
import ZenMode from '#/features/explore/components/ZenMode';

function SearchResultView() {
	const State = useDiscoverState();

	if (State.category && !State.q) return <LandingPage />;

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
			return <ZenMode />;
	}
}

export default SearchResultView;
