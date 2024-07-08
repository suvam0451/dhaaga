import { Stack } from 'expo-router/stack';

function HomeScreen() {
	return (
		<Stack
			initialRouteName={'home-home'}
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name={'index'} />
			<Stack.Screen name={'home-home'} />
			<Stack.Screen name={'new-to-app'} />
			<Stack.Screen name={'new-to-fedi'} />
		</Stack>
	);
}

export default HomeScreen;
