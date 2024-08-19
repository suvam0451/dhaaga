import { Notification_FlatList_Entry } from '../../../../../hooks/api/notifications/useApiGetNotifications';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import ReplyNotificationFragment from '../segments/ReplyNotificationFragment';
import MentionNotificationFragment from '../segments/MentionNotificationFragment';
import FavouriteNotificationFragment from '../segments/FavouriteNotificationFragment';
import FollowNotificationFragment from '../segments/FollowNotificationFragment';
import StatusAlertNotificationFragment from '../segments/StatusAlertNotificationFragment';
import BoostNotificationFragment from '../segments/BoostNotificationFragment';
import AchiEarnedNotificationFragment from '../segments/AchiEarnedNotificationFragment';
import AppNotificationFragment from '../segments/AppNotificationFragment';
import FollowReqAcceptNotificationFragment from '../segments/FollowReqAccepNotificationFragment';
import ReactionNotificationFragment from '../segments/ReactionNotificationFragment';
import { View, Text } from 'react-native';
import { APP_FONT } from '../../../../../styles/AppTheme';

/**
 * List renderer for the notification
 * screen landing page
 */
function FlatListRenderer({ item }: { item: Notification_FlatList_Entry }) {
	switch (item.type) {
		case DhaagaJsNotificationType.REPLY:
			return <ReplyNotificationFragment item={item.props} />;
		case DhaagaJsNotificationType.MENTION:
			return <MentionNotificationFragment item={item.props} />;
		case DhaagaJsNotificationType.FAVOURITE:
			return <FavouriteNotificationFragment item={item.props} />;
		case DhaagaJsNotificationType.FOLLOW:
			return <FollowNotificationFragment item={item.props} />;
		case DhaagaJsNotificationType.STATUS:
		case DhaagaJsNotificationType.NOTE:
			return <StatusAlertNotificationFragment item={item.props} />;
		case DhaagaJsNotificationType.REBLOG:
		case DhaagaJsNotificationType.RENOTE:
			return <BoostNotificationFragment item={item.props} />;
		case DhaagaJsNotificationType.ACHIEVEMENT_EARNED:
			return <AchiEarnedNotificationFragment />;
		case DhaagaJsNotificationType.APP:
			return <AppNotificationFragment />;
		case DhaagaJsNotificationType.FOLLOW_REQUEST_ACCEPTED:
			return <FollowReqAcceptNotificationFragment item={item.props} />;
		case DhaagaJsNotificationType.REACTION:
			return <ReactionNotificationFragment item={item.props} />;
		default: {
			console.log('notification type not handled', item.type);
			return (
				<View>
					<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>
						Notification Type not handled: {item.type}
					</Text>
				</View>
			);
		}
	}
}

export default FlatListRenderer;
