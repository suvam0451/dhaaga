import { View } from 'react-native';
import { APP_FONTS } from '../../styles/AppFonts';
import SimpleSoftwareBadge from '../common/software/SimpleBadge';
import {
	useAppApiClient,
	useAppTheme,
} from '../../hooks/utility/global-state-extractors';
import { AppText } from '../lib/Text';

function FeatureUnsupported() {
	const { driver } = useAppApiClient();
	const { theme } = useAppTheme();

	return (
		<View
			style={{
				padding: 16,
				paddingTop: 54 + 32,
			}}
		>
			<View
				style={{
					padding: 16,
					backgroundColor: '#202020',
					alignItems: 'center',
					borderRadius: 8,
				}}
			>
				<AppText.SemiBold
					style={{
						fontFamily: APP_FONTS.INTER_700_BOLD,
						fontSize: 16,
						textAlign: 'center',
						marginHorizontal: 32,
						color: theme.secondary.a10,
					}}
				>
					Your instance software does not support this feature.
				</AppText.SemiBold>
				<View style={{ marginTop: 16 }}>
					<SimpleSoftwareBadge software={driver} />
				</View>
			</View>
		</View>
	);
}

export default FeatureUnsupported;
