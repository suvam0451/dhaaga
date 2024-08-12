import { StyleSheet } from 'react-native';
import { Notification_Entry } from '../../../../../hooks/api/notifications/useApiGetNotifications';

export const ICON_SIZE = 36;

export type Props = {
	item: Notification_Entry;
};

export const styles = StyleSheet.create({
	container: {
		marginLeft: 0,
		marginVertical: 4,
		backgroundColor: '#242424',
		padding: 8,
		borderRadius: 8,
	},
	notificationCategoryIconContainer: {
		position: 'absolute',
		zIndex: 99,
		bottom: -6,
		right: -6,
		padding: 3,
		borderRadius: 8,
	},
	gradientContainerTextOnlyPost: {
		maxHeight: 64,
		marginTop: 8,
		borderRadius: 8,
		padding: 6,
		overflow: 'hidden',
		marginBottom: 8,
	},
	senderAvatarContainer: {
		width: ICON_SIZE + 2,
		height: ICON_SIZE + 2,
		position: 'relative',
		borderWidth: 1,
		borderColor: 'grey',
		borderRadius: 8,
	},
});
