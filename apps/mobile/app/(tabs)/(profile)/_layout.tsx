import { Stack } from 'expo-router/stack';

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
