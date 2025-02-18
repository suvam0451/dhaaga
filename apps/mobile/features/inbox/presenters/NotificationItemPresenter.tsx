import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import ReplyNotificationFragment from '../../../components/screens/notifications/landing/segments/ReplyNotificationFragment';
import MentionNotificationFragment from '../../../components/screens/notifications/landing/segments/MentionNotificationFragment';
import FavouriteNotificationFragment from '../../../components/screens/notifications/landing/segments/FavouriteNotificationFragment';
import StatusAlertNotificationFragment from '../../../components/screens/notifications/landing/segments/StatusAlertNotificationFragment';
import BoostNotificationFragment from '../../../components/screens/notifications/landing/segments/BoostNotificationFragment';
import AchiEarnedNotificationFragment from '../../../components/screens/notifications/landing/segments/AchiEarnedNotificationFragment';
import AppNotificationFragment from '../../../components/screens/notifications/landing/segments/AppNotificationFragment';
import FollowReqAcceptNotificationFragment from '../../../components/screens/notifications/landing/segments/FollowReqAccepNotificationFragment';
import ReactionNotificationFragment from '../../../components/screens/notifications/landing/segments/ReactionNotificationFragment';
import FollowPresenter from './FollowPresenter';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { FlashListType_Notification } from '../../../services/flashlist.service';
import { AppText } from '../../../components/lib/Text';
import GroupedFollowPresenter from './GroupedFollowPresenter';
import { View } from 'react-native';
import GroupedPostInteractionPresenter from './GroupedPostInteractionPresenter';

type Props = {
	item: FlashListType_Notification;
};

/**
 * List renderer for the notification
 * screen landing page
 */
export function NotificationItemPresenter({ item }: Props) {
	const { theme } = useAppTheme();

	let _obj = item.props.dto;

	if (_obj.user === null) {
		if (_obj.users.length > 1) {
			switch (item.type) {
				case DhaagaJsNotificationType.FOLLOW:
					return <GroupedFollowPresenter item={_obj} />;
				case DhaagaJsNotificationType.REBLOG:
				case DhaagaJsNotificationType.RENOTE:
				case DhaagaJsNotificationType.FAVOURITE:
					return <GroupedPostInteractionPresenter item={_obj} />;
				default:
					return <GroupedFollowPresenter item={_obj} />;
			}
		} else {
			// For a single user, render the legacy singlet components
			_obj.user = _obj.users[0].item;
		}
	}

	if (_obj.users.length > 0) return <View />;

	/**
	 * Legacy Singlet Notification Components
	 */

	switch (item.type) {
		case DhaagaJsNotificationType.REPLY:
			return <ReplyNotificationFragment item={item.props.dto} />;
		case DhaagaJsNotificationType.MENTION:
		case DhaagaJsNotificationType.CHAT:
		case DhaagaJsNotificationType.HOME:
		case DhaagaJsNotificationType.PUBLIC:
			return <MentionNotificationFragment item={item.props.dto} />;
		case DhaagaJsNotificationType.FAVOURITE:
			return <FavouriteNotificationFragment item={item.props.dto} />;
		case DhaagaJsNotificationType.FOLLOW:
			return <FollowPresenter item={item.props.dto} />;
		case DhaagaJsNotificationType.STATUS:
		case DhaagaJsNotificationType.NOTE:
			return <StatusAlertNotificationFragment item={item.props.dto} />;
		case DhaagaJsNotificationType.REBLOG:
		case DhaagaJsNotificationType.RENOTE:
			return <BoostNotificationFragment item={item.props.dto} />;
		case DhaagaJsNotificationType.ACHIEVEMENT_EARNED:
			return <AchiEarnedNotificationFragment />;
		case DhaagaJsNotificationType.APP:
			return <AppNotificationFragment />;
		case DhaagaJsNotificationType.FOLLOW_REQUEST_ACCEPTED:
			return <FollowReqAcceptNotificationFragment item={item.props.dto} />;
		case DhaagaJsNotificationType.REACTION:
			return <ReactionNotificationFragment item={item.props.dto} />;
		default: {
			console.log('notification type not handled', item.type);
			return (
				<AppText.Medium style={{ color: theme.complementaryB.a0 }}>
					Notification Type not handled: {item.type}
				</AppText.Medium>
			);
		}
	}
}

export default NotificationItemPresenter;
