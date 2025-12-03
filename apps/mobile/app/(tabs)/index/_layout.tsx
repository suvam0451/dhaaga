import { Stack } from 'expo-router/stack';

function Layout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		/>
	);
}

export default Layout;
