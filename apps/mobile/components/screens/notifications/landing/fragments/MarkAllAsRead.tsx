import { memo } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppNotifSeenContext } from '../state/useNotifSeen';
import { useAppNotificationBadge } from '../../../../../hooks/app/useAppNotificationBadge';
import NotificationVibrationToggle from './NotificationVibrationToggle';

const MarkAllAsRead = memo(() => {
	const { setNotificationCount } = useAppNotificationBadge();
	const { setAllNotifsSeen, All, Seen } = useAppNotifSeenContext();

	function onPress() {
		setAllNotifsSeen();
		setNotificationCount(0);
	}

	const unseen = All.current.size - Seen.size > 0;

	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'flex-end',
				alignItems: 'center',
				marginTop: 16,
			}}
		>
			<NotificationVibrationToggle style={styles.buttonContainer} />
			<TouchableOpacity style={styles.markAllAsReadContainer} onPress={onPress}>
				<View>
					<MaterialCommunityIcons
						name="email-check-outline"
						size={20}
						color={unseen ? APP_FONT.MONTSERRAT_BODY : APP_FONT.DISABLED}
					/>
				</View>
				<View style={{ flexShrink: 1, marginLeft: 8 }}>
					<Text
						style={{
							color: unseen ? APP_FONT.MONTSERRAT_BODY : APP_FONT.DISABLED,
						}}
					>
						Mark all as Read
					</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
});

const styles = StyleSheet.create({
	markAllAsReadContainer: {
		backgroundColor: '#242424',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		padding: 8,
		borderRadius: 8,
		marginLeft: 8,
	},
	buttonContainer: {
		backgroundColor: '#242424',
		padding: 8,
		borderRadius: 8,
		paddingHorizontal: 12,
	},
});
export default MarkAllAsRead;
