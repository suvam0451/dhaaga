import { Stack } from 'expo-router/stack';

function FavouritesScreen() {
	return (
		<Stack initialRouteName={'index'} screenOptions={{ headerShown: false }}>
			<Stack.Screen name={'index'} />
		</Stack>
	);
}

export default FavouritesScreen;
