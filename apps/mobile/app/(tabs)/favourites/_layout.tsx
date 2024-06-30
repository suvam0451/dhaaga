import { Stack } from 'expo-router/stack';

function FavouritesScreen() {
	return (
		<Stack initialRouteName={'index'} screenOptions={{ headerShown: false }}>
			<Stack.Screen name={'index'} />
			<Stack.Screen name={'bookmark-portal'} />
			<Stack.Screen name={'bookmark-gallery'} />
			<Stack.Screen name={'bookmark-classic'} />
		</Stack>
	);
}

export default FavouritesScreen;
