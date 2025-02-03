import { View } from 'react-native';
import { AppText } from '../../../components/lib/Text';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';

function FeatureNotAvailable() {
	const { theme } = useAppTheme();
	return (
		<View style={{ marginHorizontal: 32, marginTop: 64 }}>
			<AppText.Medium
				style={{ textAlign: 'center', fontSize: 28, color: theme.primary.a0 }}
			>
				Not Available
			</AppText.Medium>
			<AppText.Normal
				style={{ textAlign: 'center', marginTop: 16 }}
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
			>
				This feature is either not implemented by Dhaaga, or not available for
				your SNS platform.
			</AppText.Normal>
		</View>
	);
}

export default FeatureNotAvailable;
