import { Stack } from 'expo-router/stack';
import { useAppTheme } from '#/states/global/hooks';

function AccountsScreen() {
	const { theme } = useAppTheme();
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				navigationBarColor: theme.background.a0,
			}}
		/>
	);
}

export default AccountsScreen;
