import { Stack } from 'expo-router/stack';

function NotificationsScreen() {
	return (
		<Stack initialRouteName={'index'} screenOptions={{ headerShown: false }} />
	);
}

export default NotificationsScreen;
