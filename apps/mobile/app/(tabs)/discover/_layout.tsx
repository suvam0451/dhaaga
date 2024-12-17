import { Stack } from 'expo-router/stack';

function DiscoverScreen() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name={'index'} />
			<Stack.Screen name={'trending-tags'} />
		</Stack>
	);
}

export default DiscoverScreen;
