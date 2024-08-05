import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TimelineRenderer from '../components/common/timeline/core/Timeline';
import WithGorhomBottomSheetContext from '../states/useGorhomBottomSheet';
import WithLocalAppMenuControllerContext from '../components/shared/fab/hooks/useFabController';
import WithAppDrawerContext from '../states/useAppDrawer';
import { StatusBar } from 'react-native';
import { APP_THEME } from '../styles/AppTheme';

const Stack = createNativeStackNavigator();

function HomeScreen() {
	return (
		<WithGorhomBottomSheetContext>
			<WithLocalAppMenuControllerContext>
				<WithAppDrawerContext>
					<StatusBar backgroundColor={APP_THEME.DARK_THEME_MENUBAR} />
					<Stack.Navigator
						initialRouteName={'Mastodon timeline'}
						screenOptions={{ headerShown: false }}
					>
						<Stack.Screen
							name="Mastodon timeline"
							component={TimelineRenderer}
						/>
					</Stack.Navigator>
				</WithAppDrawerContext>
			</WithLocalAppMenuControllerContext>
		</WithGorhomBottomSheetContext>
	);
}

export default HomeScreen;
