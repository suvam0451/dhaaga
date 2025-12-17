import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { AppIcon } from '../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';

function BackNavigationButton() {
	function onPress() {
		router.back();
	}
	return (
		<View style={{ flexDirection: 'row' }}>
			<TouchableOpacity
				onPress={onPress}
				style={{
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'row',
					paddingHorizontal: 8,
					paddingVertical: 8,
				}}
			>
				<AppIcon
					id={'back'}
					size={25}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
					onPress={onPress}
				/>
			</TouchableOpacity>
		</View>
	);
}

export default BackNavigationButton;
