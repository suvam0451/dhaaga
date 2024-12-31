import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import ReplyNotificationFragment from '../segments/ReplyNotificationFragment';
import MentionNotificationFragment from '../segments/MentionNotificationFragment';
import FavouriteNotificationFragment from '../segments/FavouriteNotificationFragment';
import StatusAlertNotificationFragment from '../segments/StatusAlertNotificationFragment';
import BoostNotificationFragment from '../segments/BoostNotificationFragment';
import AchiEarnedNotificationFragment from '../segments/AchiEarnedNotificationFragment';
import AppNotificationFragment from '../segments/AppNotificationFragment';
import FollowReqAcceptNotificationFragment from '../segments/FollowReqAccepNotificationFragment';
import ReactionNotificationFragment from '../segments/ReactionNotificationFragment';
import { Text, View } from 'react-native';
import NotificationUpdateItem from './NotificationUpdateItem';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';
import { FlashListType_Notification } from '../../../../../services/flashlist.service';

/**
 * List renderer for the notification
 * screen landing page
 */
export function FlatListRenderer({
	item,
}: {
	item: FlashListType_Notification;
}) {
	const { theme } = useAppTheme();
	switch (item.type) {
		case DhaagaJsNotificationType.REPLY:
			return <ReplyNotificationFragment item={item.props.dto} />;
		case DhaagaJsNotificationType.MENTION:
		case DhaagaJsNotificationType.CHAT:
			return <MentionNotificationFragment item={item.props.dto} />;
		case DhaagaJsNotificationType.FAVOURITE:
			return <FavouriteNotificationFragment item={item.props.dto} />;
		case DhaagaJsNotificationType.FOLLOW:
			return (
				<NotificationUpdateItem
					acct={item.props.dto.user}
					type={DhaagaJsNotificationType.FOLLOW}
					createdAt={item.props.dto.createdAt}
				/>
			);
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
				<View>
					<Text style={{ color: theme.complementaryB.a0 }}>
						Notification Type not handled: {item.type}
					</Text>
				</View>
			);
		}
	}
}

export default FlatListRenderer;
