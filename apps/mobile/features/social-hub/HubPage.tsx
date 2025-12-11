import { useAppTheme, useHub } from '#/states/global/hooks';
import SocialHubTabPresenter from './presenters/SocialHubTabPresenter';
import { View } from 'react-native';

function HubPage() {
	const { theme } = useAppTheme();
	const { profiles, pageIndex } = useHub();

	return (
		<View style={{ backgroundColor: theme.palette.bg, height: '100%' }}>
			{profiles?.length > 0 ? (
				<SocialHubTabPresenter profile={profiles[pageIndex]} />
			) : (
				<View />
			)}
		</View>
	);
}

export default HubPage;
