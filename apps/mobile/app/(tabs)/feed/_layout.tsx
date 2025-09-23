import { Stack } from 'expo-router/stack';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

function DiscoverScreen() {
	const { theme } = useAppTheme();
	return (
		<Stack
			initialRouteName={'index'}
			screenOptions={{
				headerShown: false,
				navigationBarColor: theme.background.a0,
			}}
		/>
	);
}

export default DiscoverScreen;
