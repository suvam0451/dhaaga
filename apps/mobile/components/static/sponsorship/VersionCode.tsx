import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../styles/AppTheme';

/**
 * Renders the software version
 * and build flavor
 */
function VersionCode() {
	return (
		<View style={{ marginTop: 16, marginBottom: 0 }}>
			<Text
				style={{
					textAlign: 'center',
					color: APP_FONT.MONTSERRAT_BODY,
					fontFamily: 'Inter-Bold',
				}}
			>
				{'Built with' + ' 💛 by Debashish Patra'}
			</Text>
			<Text
				style={{
					textAlign: 'center',
					color: APP_FONT.MONTSERRAT_BODY,
					fontFamily: 'Inter-Bold',
				}}
			>
				v0.3.0
			</Text>
		</View>
	);
}

export default VersionCode;
