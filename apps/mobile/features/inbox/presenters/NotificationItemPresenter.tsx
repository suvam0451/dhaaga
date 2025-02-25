import { DriverNotificationType } from '@dhaaga/bridge';
import ReplyNotificationFragment from '../components/ReplyNotificationFragment';
import MentionNotificationFragment from '../components/MentionNotificationFragment';
import FavouriteNotificationFragment from '../components/FavouriteNotificationFragment';
import StatusAlertNotificationFragment from '../components/StatusAlertNotificationFragment';
import BoostNotificationFragment from '../components/BoostNotificationFragment';
import FollowReqAcceptNotificationFragment from '../components/FollowReqAccepNotificationFragment';
import ReactionNotificationFragment from '../components/ReactionNotificationFragment';
import FollowPresenter from './FollowPresenter';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { FlashListType_Notification } from '../../../services/flashlist.service';
import { AppText } from '../../../components/lib/Text';
import GroupedFollowPresenter from './GroupedFollowPresenter';
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
				case DriverNotificationType.FOLLOW:
					return <GroupedFollowPresenter item={_obj} />;
				case DriverNotificationType.REBLOG:
				case DriverNotificationType.RENOTE:
				case DriverNotificationType.FAVOURITE:
					return <GroupedPostInteractionPresenter item={_obj} />;
				default:
					return <GroupedFollowPresenter item={_obj} />;
			}
		} else if (_obj.users.length === 1) {
			// For a single user, render the legacy singlet components
			_obj = { ..._obj, user: _obj.users[0].item };
		}
	}

	// if (_obj.users.length > 0) return <View />;

	/**
	 * Legacy Singlet Notification Components
	 */

	switch (_obj.type) {
		case DriverNotificationType.REPLY:
			return <ReplyNotificationFragment item={_obj} />;
		case DriverNotificationType.MENTION:
		case DriverNotificationType.CHAT:
		case DriverNotificationType.HOME:
		case DriverNotificationType.PUBLIC:
			return <MentionNotificationFragment item={_obj} />;
		case DriverNotificationType.FAVOURITE:
			return <FavouriteNotificationFragment item={_obj} />;
		case DriverNotificationType.FOLLOW:
			return <FollowPresenter item={_obj} />;
		case DriverNotificationType.STATUS:
		case DriverNotificationType.NOTE:
			return <StatusAlertNotificationFragment item={_obj} />;
		case DriverNotificationType.REBLOG:
		case DriverNotificationType.RENOTE:
			return <BoostNotificationFragment item={_obj} />;
		case DriverNotificationType.FOLLOW_REQUEST_ACCEPTED:
			return <FollowReqAcceptNotificationFragment item={_obj} />;
		case DriverNotificationType.REACTION:
			return <ReactionNotificationFragment item={_obj} />;
		case DriverNotificationType.ACHIEVEMENT_EARNED:
		case DriverNotificationType.APP:
		default: {
			console.log('notification type not handled', _obj.type);
			return (
				<AppText.Medium style={{ color: theme.complementaryB.a0 }}>
					Notification Type not handled: {_obj.type}
				</AppText.Medium>
			);
		}
	}
}

export default NotificationItemPresenter;
