import { memo } from 'react';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';

const TopNavbarBackButton = memo(() => {
	return (
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
			<Ionicons
				name="chevron-back"
				size={24}
				color="rgba(255, 255, 255, 0.6)"
			/>
		</TouchableOpacity>
	);
});

export default TopNavbarBackButton;
