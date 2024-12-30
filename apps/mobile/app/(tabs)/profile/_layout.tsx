import { Stack } from 'expo-router/stack';

function AccountsScreen() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name={'index'} />
		</Stack>
	);
}

export default AccountsScreen;
