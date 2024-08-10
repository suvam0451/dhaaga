import { View } from 'react-native';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import ControlSegment from '../../../widgets/feed-controller/components/ControlSegment';
import { Text } from '@rneui/themed';
import { useEffect, useRef } from 'react';
import { AnimatedFlashList } from '@shopify/flash-list';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import useHookLoadingState from '../../../../states/useHookLoadingState';
import { APP_FONT } from '../../../../styles/AppTheme';
import MentionNotificationFragment from './segments/MentionNotificationFragment';
import FavouriteNotificationFragment from './segments/FavouriteNotificationFragment';
import { Link, useNavigation } from 'expo-router';
import FollowNotificationFragment from './segments/FollowNotificationFragment';
import BoostNotificationFragment from './segments/BoostNotificationFragment';
import useApiGetNotifications, {
	Notification_FlatList_Entry,
} from '../../../../api/notifications/useApiGetNotifications';
import AchiEarnedNotificationFragment from './segments/AchiEarnedNotificationFragment';
import AppNotificationFragment from './segments/AppNotificationFragment';
import FollowReqAccepNotificationFragment from './segments/FollowReqAccepNotificationFragment';
import ReactionNotificationFragment from './segments/ReactionNotificationFragment';
import ReplyNotificationFragment from './segments/ReplyNotificationFragment';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useAppNotifSeenContext } from './state/useNotifSeen';
import StatusAlertNotificationFragment from './segments/StatusAlertNotificationFragment';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MarkAllAsRead from './fragments/MarkAllAsRead';
import NotificationControlSegment from './fragments/NotificationControlSegment';

function FlashListRenderer({ item }: { item: Notification_FlatList_Entry }) {
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
			return <StatusAlertNotificationFragment item={item.props} />;
		case DhaagaJsNotificationType.REBLOG:
			return <BoostNotificationFragment item={item.props} />;
		case DhaagaJsNotificationType.ACHIEVEMENT_EARNED:
			return <AchiEarnedNotificationFragment />;
		case DhaagaJsNotificationType.APP:
			return <AppNotificationFragment />;
		case DhaagaJsNotificationType.FOLLOW_REQUEST_ACCEPTED:
			return <FollowReqAccepNotificationFragment item={item.props} />;
		case DhaagaJsNotificationType.REACTION:
			return <ReactionNotificationFragment item={item.props} />;
		default: {
			console.log('notification type not handled', item.type);
			return (
				<View>
					<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>
						Notification Type not handled
					</Text>
				</View>
			);
		}
	}
}

function LandingPageStack() {
	const { translateY, onScroll } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});
	const { Seen, All, UnseenCount, appendNotifs } = useAppNotifSeenContext();
	const { State } = useHookLoadingState();
	const { Results, refetch } = useApiGetNotifications();

	useEffect(() => {
		appendNotifs(Results.map((o) => o.props.id));
	}, [Results]);

	useEffect(() => {
		const intervalFunction = () => {
			refetch();
		};
		const intervalId = setInterval(intervalFunction, 15000);
		return () => {
			clearInterval(intervalId);
		};
	}, []);

	return (
		<WithAutoHideTopNavBar
			title={'Notification Center'}
			translateY={translateY}
		>
			<AnimatedFlashList
				onScroll={onScroll}
				estimatedItemSize={45}
				contentContainerStyle={{
					paddingTop: 54,
					paddingHorizontal: 8,
					paddingBottom: 54,
				}}
				ListHeaderComponent={
					<View style={{ marginBottom: 16 }}>
						<View
							style={{
								justifyContent: 'flex-end',
								marginVertical: 8,
							}}
						>
							<MarkAllAsRead />
						</View>
						<NotificationControlSegment />
					</View>
				}
				data={Results}
				renderItem={FlashListRenderer}
				getItemType={(o) => o.type}
			/>
		</WithAutoHideTopNavBar>
	);
}

export default LandingPageStack;
