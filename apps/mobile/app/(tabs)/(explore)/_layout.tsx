import { Stack } from 'expo-router/stack';
import {
	useActiveUserSession,
	useAppActiveSession,
} from '#/states/global/hooks';
import { Redirect } from 'expo-router';

function Layout() {
	const { acct } = useActiveUserSession();
	const { session } = useAppActiveSession();

	if (!acct || session.state !== 'valid')
		return <Redirect withAnchor href={'/(hub)/central'} />;

	return (
		<Stack
			initialRouteName={'search'}
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name={'search'} />
			<Stack.Screen name={'history'} />
			<Stack.Screen name={'user-guide'} />
		</Stack>
	);
}

export default Layout;
