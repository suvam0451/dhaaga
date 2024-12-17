import { memo } from 'react';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { AppIcon } from '../../../lib/Icon';

const TopNavbarBackButton = memo(() => {
	return (
		<View style={{ flexDirection: 'row' }}>
			<TouchableOpacity
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
				<AppIcon id={'back'} emphasis={'medium'} />
			</TouchableOpacity>
		</View>
	);
});

export default TopNavbarBackButton;
