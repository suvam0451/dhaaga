import { Stack } from 'expo-router/stack';
import {
	useAppAcct,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { Redirect } from 'expo-router';

function NotificationsScreen() {
	const { theme } = useAppTheme();
	const { acct } = useAppAcct();

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

export default NotificationsScreen;
