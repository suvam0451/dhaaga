import { StyleSheet } from 'react-native';
import { NotificationParser } from '@dhaaga/bridge';

export const ICON_SIZE = 36;

export type Props = {
	item: NotificationParser;
};

export const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 10,
		width: '100%',
	},
	groupIndicatorIcon: {
		padding: 4,
		borderRadius: '100%',
		borderColor: 'black',
		borderWidth: 3,
	},
	notificationCategoryIconContainer: {
		position: 'absolute',
		zIndex: 99,
		bottom: -9,
		right: -9,
		padding: 0.5,
		borderRadius: '100%',
		borderColor: 'black',
		borderWidth: 3,
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
	senderAvatarContainer: {
		width: ICON_SIZE + 2,
		height: ICON_SIZE + 2,
		position: 'relative',
		borderWidth: 1,
		borderColor: 'grey',
		borderRadius: ICON_SIZE / 2,
	},
});
