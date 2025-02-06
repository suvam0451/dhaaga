import { Stack } from 'expo-router/stack';

const Layout = () => (
	<Stack initialRouteName={'index'} screenOptions={{ headerShown: false }} />
);

export default Layout;
