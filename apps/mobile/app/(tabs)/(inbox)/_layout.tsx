import { Stack } from 'expo-router/stack';
import {
	useActiveUserSession,
	useAppActiveSession,
	useAppTheme,
} from '#/states/global/hooks';
import { Redirect } from 'expo-router';

function NotificationsScreen() {
	const { acct } = useActiveUserSession();
	const { session } = useAppActiveSession();

	if (!acct || session.state !== 'valid') return <Redirect href={'/'} />;
	return (
		<Stack
			initialRouteName={'inbox'}
			screenOptions={{
				headerShown: false,
			}}
		/>
	);
}

export default NotificationsScreen;
