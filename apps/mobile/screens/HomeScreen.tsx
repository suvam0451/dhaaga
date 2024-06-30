import ApiWrapper from '../components/common/tag/TagBrowseLocal';
import UserProfile from './shared/profile/UserProfile';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostWithClientContext from './shared/Post';
import TimelineRenderer from './timelines/mastodon/TimelineRenderer';
import WithGorhomBottomSheetContext from '../states/useGorhomBottomSheet';
import WhatIsFediverse from '../components/screens/home/stack/WhatIsFediverse';
import NewToDhaaga from '../components/screens/home/stack/NewToDhaaga';

const Stack = createNativeStackNavigator();

function HomeScreen() {
	return (
		<WithGorhomBottomSheetContext>
			<Stack.Navigator
				initialRouteName={'Mastodon timeline'}
				screenOptions={{ headerShown: false }}
			>
				<Stack.Screen name="Mastodon timeline" component={TimelineRenderer} />
				{/*<Stack.Screen name="What is Fediverse" component={WhatIsFediverse} />*/}
				{/*<Stack.Screen name="New To Dhaaga" component={NewToDhaaga} />*/}
				<Stack.Screen name="Mastodon Local" component={TimelineRenderer} />
				<Stack.Screen name="Browse Hashtag" component={ApiWrapper} />
				<Stack.Screen name="Profile" component={UserProfile} />
				<Stack.Screen name="Post" component={PostWithClientContext} />
			</Stack.Navigator>
		</WithGorhomBottomSheetContext>
	);
}

export default HomeScreen;
