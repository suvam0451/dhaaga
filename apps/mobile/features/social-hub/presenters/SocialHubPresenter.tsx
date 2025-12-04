import {
	useAppTheme,
	useHub,
} from '../../../hooks/utility/global-state-extractors';
import SocialHubTabPresenter from './SocialHubTabPresenter';
import { View } from 'react-native';

function SocialHubPresenter() {
	const { theme } = useAppTheme();
	const { profiles, pageIndex } = useHub();

	return (
		<View style={{ backgroundColor: theme.palette.bg, height: '100%' }}>
			{profiles && profiles.length > 0 ? (
				<SocialHubTabPresenter profile={profiles[pageIndex]} />
			) : (
				<View />
			)}
		</View>
	);
}

export default SocialHubPresenter;
