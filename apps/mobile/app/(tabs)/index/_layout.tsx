import { Stack } from 'expo-router/stack';
import WithGorhomBottomSheetContext from '../../../states/useGorhomBottomSheet';
import { StatusBar } from 'react-native';
import { APP_THEME } from '../../../styles/AppTheme';
import WithAppDrawerContext from '../../../states/useAppDrawer';
import WithLocalAppMenuControllerContext from '../../../components/shared/fab/hooks/useFabController';

function Layout() {
	return (
		<WithGorhomBottomSheetContext>
			<WithLocalAppMenuControllerContext>
				<WithAppDrawerContext>
					<StatusBar backgroundColor={APP_THEME.DARK_THEME_MENUBAR} />
					<Stack
						initialRouteName={'home-home'}
						screenOptions={{ headerShown: false }}
					>
						<Stack.Screen name={'index'} />
						<Stack.Screen name={'home-home'} />
						<Stack.Screen name={'new-to-app'} />
						<Stack.Screen name={'new-to-fedi'} />
					</Stack>
				</WithAppDrawerContext>
			</WithLocalAppMenuControllerContext>
		</WithGorhomBottomSheetContext>
	);
}

export default Layout;
