import { AppText } from '#/components/lib/Text';
import NavBar_Simple from '#/components/shared/topnavbar/NavBar_Simple';
import { View } from 'react-native';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';

function Page() {
	const { theme } = useAppTheme();
	return (
		<>
			<NavBar_Simple label={'Manage Subscriptions'} />
			<View
				style={{
					flex: 1,
					paddingTop: 100,
					backgroundColor: theme.background.a0,
				}}
			>
				<AppText.Medium style={{ textAlign: 'center' }}>
					This feature is being built 🚧
				</AppText.Medium>
			</View>
		</>
	);
}

export default Page;
