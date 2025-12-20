import { StyleSheet } from 'react-native';
import {
	NotificationUserGroupType,
	PostObjectType,
	UserObjectType,
} from '@dhaaga/bridge';

export const ICON_SIZE = 36;

export type GroupedNotificationWithPostProps = {
	users: NotificationUserGroupType[];
	post: PostObjectType;
	createdAt: Date;
};

export type GroupedNotificationWithUserProps = {
	users: NotificationUserGroupType[];
	createdAt: Date;
};

export type UngroupedNotificationWithPostProps = {
	user: UserObjectType;
	post: PostObjectType;
	createdAt: Date;
	extraData?: any;
};

export type UngroupedNotificationWithUserProps = {
	user: UserObjectType;
	createdAt: Date;
	extraData?: any;
};

export const styles = StyleSheet.create({
	container: {
		marginHorizontal: 6,
		paddingHorizontal: 6,
		borderRadius: 8,
		paddingVertical: 8,
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
	senderAvatarContainer: {
		width: ICON_SIZE + 2,
		height: ICON_SIZE + 2,
		position: 'relative',
		borderWidth: 1,
		borderColor: 'grey',
		borderRadius: ICON_SIZE / 2,
	} /**
	 * Shows createdAt and ellipsis icon
	 */,
	moreOptionsButtonContainer: {
		paddingHorizontal: 4,
		paddingLeft: 16,
		flexDirection: 'row',
		height: '100%',
		alignItems: 'center',
	},
});
