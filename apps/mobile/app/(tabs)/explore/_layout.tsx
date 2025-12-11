import { Stack } from 'expo-router/stack';
import { useActiveUserSession, useAppTheme } from '#/states/global/hooks';
import { Redirect } from 'expo-router';

function Layout() {
	const { theme } = useAppTheme();
	const { acct } = useActiveUserSession();

	if (!acct) return <Redirect href={'/'} />;
	return (
		<Stack
			initialRouteName={'index'}
			screenOptions={{
				headerShown: false,
				navigationBarColor: theme.background.a0,
			}}
		/>
	);
}

export default Layout;
