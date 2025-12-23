import { Stack } from 'expo-router/stack';
import {
	useActiveUserSession,
	useAppActiveSession,
	useAppTheme,
} from '#/states/global/hooks';
import { Redirect } from 'expo-router';

function Layout() {
	const { acct } = useActiveUserSession();
	const { session } = useAppActiveSession();

	if (!acct || session.state !== 'valid') return <Redirect href={'/'} />;

	return (
		<Stack
			initialRouteName={'explore'}
			screenOptions={{
				headerShown: false,
			}}
		/>
	);
}

export default Layout;
