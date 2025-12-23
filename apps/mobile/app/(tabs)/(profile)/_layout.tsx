import { Stack } from 'expo-router/stack';
import { useAppTheme } from '#/states/global/hooks';

function AccountsScreen() {
	return (
		<Stack
			initialRouteName={'home'}
			screenOptions={{
				headerShown: false,
			}}
		/>
	);
}

export default AccountsScreen;
