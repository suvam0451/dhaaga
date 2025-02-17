import { Stack } from 'expo-router/stack';
import WithAppDrawerContext from '../../../states/useAppDrawer';
import WithLocalAppMenuControllerContext from '../../../components/shared/fab/hooks/useFabController';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

function Layout() {
	const { theme } = useAppTheme();
	return (
		<WithLocalAppMenuControllerContext>
			<WithAppDrawerContext>
				<Stack
					initialRouteName={'index'}
					screenOptions={{
						headerShown: false,
						navigationBarColor: theme.background.a0,
					}}
				/>
			</WithAppDrawerContext>
		</WithLocalAppMenuControllerContext>
	);
}

export default Layout;
