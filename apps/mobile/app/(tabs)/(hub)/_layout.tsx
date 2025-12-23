import { Stack } from 'expo-router/stack';

function Layout() {
	return (
		<Stack
			initialRouteName={'central'}
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name={'central'} />
			<Stack.Screen name={'skins'} />
			<Stack.Screen name={'user-guide'} />
		</Stack>
	);
}

export default Layout;
