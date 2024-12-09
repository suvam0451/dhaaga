import { Stack } from 'expo-router/stack';
import WithAppDrawerContext from '../../../states/useAppDrawer';
import WithLocalAppMenuControllerContext from '../../../components/shared/fab/hooks/useFabController';

function Layout() {
	return (
		<WithLocalAppMenuControllerContext>
			<WithAppDrawerContext>
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
