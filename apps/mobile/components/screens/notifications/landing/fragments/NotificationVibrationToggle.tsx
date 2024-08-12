import { memo, useCallback } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { useAppNotificationBadge } from '../../../../../hooks/app/useAppNotificationBadge';

type NotificationVibrationToggleProps = {
	style: StyleProp<ViewStyle>;
};

const NotificationVibrationToggle = memo(
	({ style }: NotificationVibrationToggleProps) => {
		const { setVibrationOn, vibrationOn } = useAppNotificationBadge();
		const onPress = useCallback(() => {
			setVibrationOn((o) => !o);
		}, []);

		return (
			<TouchableOpacity style={style} onPress={onPress}>
				<MaterialCommunityIcons
					name={vibrationOn ? 'vibrate' : 'vibrate-off'}
					size={20}
					color={APP_FONT.MONTSERRAT_BODY}
				/>
			</TouchableOpacity>
		);
	},
);

export default NotificationVibrationToggle;
