import { Stack } from 'expo-router/stack';

function Layout() {
	return (
		<Stack
			initialRouteName={'index'}
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name={'index'} />
			<Stack.Screen name={'skins'} />
			<Stack.Screen name={'user-guide'} />
		</Stack>
	);
}

export default Layout;
