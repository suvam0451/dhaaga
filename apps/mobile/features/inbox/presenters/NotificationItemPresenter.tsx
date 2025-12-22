import { DriverNotificationType } from '@dhaaga/bridge';
import ReplyNotificationFragment from '../components/ReplyNotificationFragment';
import MentionNotificationFragment from '../components/MentionNotificationFragment';
import FavouriteNotificationFragment from '../components/FavouriteNotificationFragment';
import StatusAlertNotificationFragment from '../components/StatusAlertNotificationFragment';
import BoostNotificationFragment from '../components/BoostNotificationFragment';
import FollowReqAcceptNotificationFragment from '../components/FollowReqAccepNotificationFragment';
import ReactionNotificationFragment from '../components/ReactionNotificationFragment';
import FollowPresenter from './FollowPresenter';
import { useAppTheme } from '#/states/global/hooks';
import GroupedFollowPresenter from './GroupedFollowPresenter';
import GroupedPostInteractionPresenter from './GroupedPostInteractionPresenter';
import type { NotificationObjectType } from '@dhaaga/bridge';
import QuotePostNotification from '#/features/inbox/components/QuotePostNotification';
import { NativeTextBold } from '#/ui/NativeText';

type Props = {
	item: NotificationObjectType;
};

/**
 * List renderer for the notification
 * screen landing page
 */
export function NotificationItemPresenter({ item }: Props) {
	const { theme } = useAppTheme();

	/**
	 * Grouped Notification Variants
	 */

	if (item.users.length > 1) {
		const _object = {
			users: item.users,
			post: item.post,
			createdAt: item.createdAt,
		};
		switch (item.type) {
			case DriverNotificationType.FOLLOW:
				return <GroupedFollowPresenter {..._object} />;
			case DriverNotificationType.REBLOG:
			case DriverNotificationType.RENOTE:
			case DriverNotificationType.FAVOURITE:
			case DriverNotificationType.LIKE:
				return <GroupedPostInteractionPresenter {..._object} />;
			default: {
				return <GroupedFollowPresenter {..._object} />;
			}
		}
	}

	const _user = item.users?.length > 0 ? item.users[0].item : null;
	const _post = item.post;
	const _createdAt = item.createdAt;

	const object = {
		user: _user,
		post: _post,
		createdAt: _createdAt,
	};

	switch (item.type) {
		case DriverNotificationType.REPLY:
			return <ReplyNotificationFragment {...object} />;
		case DriverNotificationType.MENTION:
		case DriverNotificationType.CHAT:
		case DriverNotificationType.HOME:
		case DriverNotificationType.PUBLIC:
			return <MentionNotificationFragment {...object} />;
		case DriverNotificationType.FAVOURITE:
		case DriverNotificationType.LIKE:
			return <FavouriteNotificationFragment {...object} />;
		case DriverNotificationType.FOLLOW:
			return <FollowPresenter {...object} />;
		case DriverNotificationType.STATUS:
		case DriverNotificationType.NOTE:
			return <StatusAlertNotificationFragment {...object} />;
		case DriverNotificationType.REBLOG:
		case DriverNotificationType.RENOTE:
		case DriverNotificationType.REPOST:
			return <BoostNotificationFragment {...object} />;
		case DriverNotificationType.FOLLOW_REQUEST_ACCEPTED:
			return <FollowReqAcceptNotificationFragment {...object} />;
		case DriverNotificationType.REACTION:
			return <ReactionNotificationFragment {...object} />;
		case DriverNotificationType.ACHIEVEMENT_EARNED:
		case DriverNotificationType.APP:
		case DriverNotificationType.QUOTE:
			return <QuotePostNotification {...object} />;
		default: {
			console.log('notification type not handled', item.type);
			return (
				<NativeTextBold style={{ color: theme.complementary }}>
					Notification Type not handled: {item.type}
				</NativeTextBold>
			);
		}
	}
}

export default NotificationItemPresenter;
