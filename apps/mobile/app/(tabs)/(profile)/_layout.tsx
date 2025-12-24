import { Stack } from 'expo-router/stack';

function AccountsScreen() {
	return (
		<Stack
			initialRouteName={'home'}
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name={'home'} />
			<Stack.Screen name={'profiles'} />
			<Stack.Screen name={'dhaaga/collections'} />
			<Stack.Screen name={'dhaaga/collection'} />
			<Stack.Screen name={'dhaaga/drafts'} />
			<Stack.Screen name={'dhaaga/hub-profiles'} />
			<Stack.Screen name={'dhaaga/skins'} />
		</Stack>
	);
}

export default AccountsScreen;
