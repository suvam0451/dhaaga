import { DriverNotificationType } from '@dhaaga/bridge';
import ReplyNotificationFragment from '../components/ReplyNotificationFragment';
import MentionNotificationFragment from '../components/MentionNotificationFragment';
import FavouriteNotificationFragment from '../components/FavouriteNotificationFragment';
import StatusAlertNotificationFragment from '../components/StatusAlertNotificationFragment';
import BoostNotificationFragment from '../components/BoostNotificationFragment';
import FollowReqAcceptNotificationFragment from '../components/FollowReqAccepNotificationFragment';
import ReactionNotificationFragment from '../components/ReactionNotificationFragment';
import FollowPresenter from './FollowPresenter';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import { AppText } from '#/components/lib/Text';
import GroupedFollowPresenter from './GroupedFollowPresenter';
import GroupedPostInteractionPresenter from './GroupedPostInteractionPresenter';
import type { NotificationObjectType } from '@dhaaga/bridge/typings';

type Props = {
	item: NotificationObjectType;
};

/**
 * List renderer for the notification
 * screen landing page
 */
export function NotificationItemPresenter({ item }: Props) {
	const { theme } = useAppTheme();

	if (item.user === null) {
		if (item.users.length > 1) {
			switch (item.type) {
				case DriverNotificationType.FOLLOW:
					return <GroupedFollowPresenter item={item} />;
				case DriverNotificationType.REBLOG:
				case DriverNotificationType.RENOTE:
				case DriverNotificationType.FAVOURITE:
					return <GroupedPostInteractionPresenter item={item} />;
				default:
					return <GroupedFollowPresenter item={item} />;
			}
		} else if (item.users.length === 1) {
			// For a single user, render the legacy singlet components
			item = { ...item, user: item.users[0].item };
		}
	}

	switch (item.type) {
		case DriverNotificationType.REPLY:
			return <ReplyNotificationFragment item={item} />;
		case DriverNotificationType.MENTION:
		case DriverNotificationType.CHAT:
		case DriverNotificationType.HOME:
		case DriverNotificationType.PUBLIC:
			return <MentionNotificationFragment item={item} />;
		case DriverNotificationType.FAVOURITE:
			return <FavouriteNotificationFragment item={item} />;
		case DriverNotificationType.FOLLOW:
			return <FollowPresenter item={item} />;
		case DriverNotificationType.STATUS:
		case DriverNotificationType.NOTE:
			return <StatusAlertNotificationFragment item={item} />;
		case DriverNotificationType.REBLOG:
		case DriverNotificationType.RENOTE:
			return <BoostNotificationFragment item={item} />;
		case DriverNotificationType.FOLLOW_REQUEST_ACCEPTED:
			return <FollowReqAcceptNotificationFragment item={item} />;
		case DriverNotificationType.REACTION:
			return <ReactionNotificationFragment item={item} />;
		case DriverNotificationType.ACHIEVEMENT_EARNED:
		case DriverNotificationType.APP:
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
