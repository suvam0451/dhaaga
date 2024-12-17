import { Stack } from 'expo-router/stack';

function AccountsScreen() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name={'landing'} />
		</Stack>
	);
}

export default AccountsScreen;
