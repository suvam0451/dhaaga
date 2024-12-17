import { Stack } from 'expo-router/stack';
import WithAppDrawerContext from '../../../states/useAppDrawer';
import WithLocalAppMenuControllerContext from '../../../components/shared/fab/hooks/useFabController';

function Layout() {
	return (
		<WithLocalAppMenuControllerContext>
			<WithAppDrawerContext>
				<Stack
					initialRouteName={'index'}
					screenOptions={{ headerShown: false }}
				/>
			</WithAppDrawerContext>
		</WithLocalAppMenuControllerContext>
	);
}

export default Layout;
