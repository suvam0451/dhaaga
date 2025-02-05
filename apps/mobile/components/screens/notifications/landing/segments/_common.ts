import { StyleSheet } from 'react-native';
import { AppNotificationObject } from '../../../../../types/app-notification.types';

export const ICON_SIZE = 36;

export type Props = {
	item: AppNotificationObject;
};

export const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 10,
		width: '100%',
	},
	notificationCategoryIconContainer: {
		position: 'absolute',
		zIndex: 99,
		bottom: -6,
		right: -6,
		padding: 3,
		borderRadius: '100%',
	},
	gradientContainerTextOnlyPost: {
		// maxHeight: 128,
		// flex: 1,
		marginTop: 8,
		borderRadius: 8,
		padding: 6,
		overflow: 'hidden',
		marginBottom: 8,
	},
});
