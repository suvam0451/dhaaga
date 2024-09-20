import { Stack } from 'expo-router/stack';
import WithGorhomBottomSheetContext from '../../../states/useGorhomBottomSheet';
import { StatusBar } from 'react-native';
import { APP_THEME } from '../../../styles/AppTheme';
import WithAppDrawerContext from '../../../states/useAppDrawer';
import WithLocalAppMenuControllerContext from '../../../components/shared/fab/hooks/useFabController';
import { useAppTheme } from '../../../hooks/app/useAppThemePack';

function Layout() {
	const { colorScheme } = useAppTheme();
	return (
		<WithLocalAppMenuControllerContext>
			<WithAppDrawerContext>
				<StatusBar backgroundColor={colorScheme.palette.menubar} />
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
	);
}

export default Layout;
