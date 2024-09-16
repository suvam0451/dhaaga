import { memo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity, View } from 'react-native';
import { APP_FONT } from '../../../../styles/AppTheme';

const TopNavbarMenuButton = memo(() => {
	return (
		<TouchableOpacity
			onPress={() => {}}
			style={{
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'row',
				paddingLeft: 10,
			}}
		>
			<View style={{ width: 42 }}>
				<Ionicons name="menu" size={24} color={APP_FONT.HIGH_EMPHASIS} />
			</View>
		</TouchableOpacity>
	);
});

export default TopNavbarMenuButton;
