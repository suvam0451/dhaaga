import { Stack } from 'expo-router/stack';
import {
	useActiveUserSession,
	useAppActiveSession,
} from '#/states/global/hooks';
import { Redirect } from 'expo-router';

function DiscoverScreen() {
	const { acct } = useActiveUserSession();
	const { session } = useAppActiveSession();

	if (!acct || session.state !== 'valid')
		return <Redirect withAnchor href={'/(hub)/central'} />;

	return (
		<Stack
			initialRouteName={'unified'}
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name={'unified'} />
			<Stack.Screen name={'user-guide'} />
		</Stack>
	);
}

export default DiscoverScreen;
