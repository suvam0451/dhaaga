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
		</Stack>
	);
}

export default Layout;
