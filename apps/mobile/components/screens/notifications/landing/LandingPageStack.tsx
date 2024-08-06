import { Button, View } from 'react-native';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import ControlSegment from '../../../widgets/feed-controller/components/ControlSegment';
import { Text } from '@rneui/themed';
import { useRef } from 'react';
import { AnimatedFlashList } from '@shopify/flash-list';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import useHookLoadingState from '../../../../states/useHookLoadingState';
import { APP_FONT } from '../../../../styles/AppTheme';
import MentionNotificationFragment from './segments/MentionNotificationFragment';
import FavouriteNotificationFragment from './segments/FavouriteNotificationFragment';
import { Link } from 'expo-router';
import FollowNotificationFragment from './segments/FollowNotificationFragment';
import BoostNotificationFragment from './segments/BoostNotificationFragment';
import useApiGetNotifications, {
	Notification_FlatList_Entry,
} from '../../../../api/notifications/useApiGetNotifications';
import AchiEarnedNotificationFragment from './segments/AchiEarnedNotificationFragment';
import AppNotificationFragment from './segments/AppNotificationFragment';
import FollowReqAccepNotificationFragment from './segments/FollowReqAccepNotificationFragment';
import ReactionNotificationFragment from './segments/ReactionNotificationFragment';

function FlashListRenderer({ item }: { item: Notification_FlatList_Entry }) {
	switch (item.type) {
		case DhaagaJsNotificationType.MENTION: {
			return <MentionNotificationFragment item={item.props} />;
		}
		case DhaagaJsNotificationType.FAVOURITE: {
			return <FavouriteNotificationFragment item={item.props} />;
		}
		case DhaagaJsNotificationType.FOLLOW: {
			return <FollowNotificationFragment item={item.props} />;
		}
		case DhaagaJsNotificationType.REBLOG: {
			return <BoostNotificationFragment item={item.props} />;
		}
		case DhaagaJsNotificationType.ACHIEVEMENT_EARNED: {
			return <AchiEarnedNotificationFragment />;
		}
		case DhaagaJsNotificationType.APP: {
			return <AppNotificationFragment />;
		}
		case DhaagaJsNotificationType.FOLLOW_REQUEST_ACCEPTED: {
			return <FollowReqAccepNotificationFragment item={item.props} />;
		}
		case DhaagaJsNotificationType.REACTION: {
			return <ReactionNotificationFragment item={item.props} />;
		}
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
	const { translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	const { State } = useHookLoadingState();
	const { Results, maxId, minId, refetch } = useApiGetNotifications();

	function onRefetch() {
		refetch();
	}

	const NotificationFilters = useRef(new Set(['all']));
	return (
		<WithAutoHideTopNavBar
			title={'Notification Center'}
			translateY={translateY}
		>
			<AnimatedFlashList
				estimatedItemSize={45}
				contentContainerStyle={{
					paddingTop: 54,
					paddingHorizontal: 8,
					paddingBottom: 54,
				}}
				ListHeaderComponent={
					<View style={{ marginBottom: 16 }}>
						<Button onPress={onRefetch} title={'Porforr'} />
						<Link href={'/notifications/conversations'}>
							<View>
								<Text>Conversations</Text>
							</View>
						</Link>
						<ControlSegment
							hash={State}
							selection={NotificationFilters.current}
							label={'User Interactions'}
							buttons={[
								{
									label: 'All',
									lookupId: 'all',
									onClick: () => {},
								},
								{
									label: 'Mentions',
									lookupId: DhaagaJsNotificationType.MENTION,
									onClick: () => {},
								},
								{
									label: 'Boosts',
									lookupId: DhaagaJsNotificationType.REBLOG,
									onClick: () => {},
								},
								{
									label: 'Favourites',
									lookupId: DhaagaJsNotificationType.FAVOURITE,
									onClick: () => {},
								},
								{
									lookupId: 'none',
									label: 'None',
									onClick: () => {},
								},
							]}
						/>

						<ControlSegment
							hash={State}
							selection={NotificationFilters.current}
							label={'Social Links'}
							buttons={[
								{
									lookupId: 'all',
									label: 'All',
									onClick: () => {},
								},
								{
									lookupId: DhaagaJsNotificationType.FOLLOW,
									label: 'Follow',
									onClick: () => {},
								},
								{
									lookupId: DhaagaJsNotificationType.FOLLOW_REQUEST,
									label: 'Requests',
									onClick: () => {},
								},
								{
									lookupId: 'none',
									label: 'None',
									onClick: () => {},
								},
							]}
						/>
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
