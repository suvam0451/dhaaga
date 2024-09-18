import { memo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';
import {
	APP_BOTTOM_SHEET_ENUM,
	useAppBottomSheet,
} from '../../../dhaaga-bottom-sheet/modules/_api/useAppBottomSheet';

const TopNavbarMenuButton = memo(() => {
	const { colorScheme } = useAppTheme();
	const { setVisible, setType, updateRequestId } = useAppBottomSheet();

	function onPress() {
		setType(APP_BOTTOM_SHEET_ENUM.SWITCH_THEME_PACK);
		updateRequestId();
		setVisible(true);
	}

	return (
		<TouchableOpacity
			onPress={onPress}
			style={{
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'row',
				paddingLeft: 10,
			}}
		>
			<View style={{ width: 42 }}>
				<Ionicons
					name="color-palette-outline"
					size={24}
					color={colorScheme.textColor.high}
				/>
			</View>
		</TouchableOpacity>
	);
});

export default TopNavbarMenuButton;
