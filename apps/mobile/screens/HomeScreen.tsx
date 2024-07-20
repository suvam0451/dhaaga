import ApiWrapper from '../components/common/tag/TagBrowseLocal';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostWithClientContext from './shared/Post';
import TimelineRenderer from './timelines/mastodon/TimelineRenderer';
import WithGorhomBottomSheetContext from '../states/useGorhomBottomSheet';
import WithLocalAppMenuControllerContext from '../components/shared/fab/hooks/useFabController';
import WithAppDrawerContext from '../states/useAppDrawer';

const Stack = createNativeStackNavigator();

function HomeScreen() {
	return (
		<WithGorhomBottomSheetContext>
			<WithLocalAppMenuControllerContext>
				<WithAppDrawerContext>
					<Stack.Navigator
						initialRouteName={'Mastodon timeline'}
						screenOptions={{ headerShown: false }}
					>
						<Stack.Screen
							name="Mastodon timeline"
							component={TimelineRenderer}
						/>
						<Stack.Screen name="Browse Hashtag" component={ApiWrapper} />
						<Stack.Screen name="Post" component={PostWithClientContext} />
					</Stack.Navigator>
				</WithAppDrawerContext>
			</WithLocalAppMenuControllerContext>
		</WithGorhomBottomSheetContext>
	);
}

export default HomeScreen;
