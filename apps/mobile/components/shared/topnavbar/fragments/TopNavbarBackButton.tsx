import { memo } from 'react';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity, View } from 'react-native';
import { APP_FONT } from '../../../../styles/AppTheme';
import useAppNavigator from '../../../../states/useAppNavigator';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';

const TopNavbarBackButton = memo(() => {
	const { colorScheme } = useAppTheme();
	const { toHome } = useAppNavigator();
	return (
		<View style={{ flexDirection: 'row' }}>
			<TouchableOpacity
				onLongPress={toHome}
				onPress={() => {
					router.back();
				}}
				style={{
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'row',
					paddingHorizontal: 8,
				}}
			>
				<Ionicons
					name="chevron-back"
					size={24}
					color={colorScheme.textColor.emphasisC}
				/>
			</TouchableOpacity>
		</View>
	);
});

export default TopNavbarBackButton;
