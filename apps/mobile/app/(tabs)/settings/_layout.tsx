import { Stack } from 'expo-router/stack';

function SettingsScreen() {
	return (
		<Stack initialRouteName={'index'} screenOptions={{ headerShown: false }}>
			<Stack.Screen name={'index'} />
			<Stack.Screen name="server-debugger" />
		</Stack>
	);
}

export default SettingsScreen;
