import { useRealm } from '@realm/react';
import { Account } from '../../../../entities/account.entity';
import { View } from 'react-native';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import ControlSegment from '../../../widgets/feed-controller/components/ControlSegment';
import { Text } from '@rneui/themed';
import useLandingPageStackApi, { AppNotificationGroup } from './api';
import { useRef } from 'react';
import { AnimatedFlashList } from '@shopify/flash-list';
import { DhaagaJsNotificationType } from '@dhaaga/shared-abstraction-activitypub';
import useHookLoadingState from '../../../../states/useHookLoadingState';
import { APP_FONT } from '../../../../styles/AppTheme';

interface MentionItem {
	props: AppNotificationGroup;
	type: DhaagaJsNotificationType.MENTION;
}

type ListItem = MentionItem;

function FlashListRenderer({ item }: { item: ListItem }) {
	switch (item.type) {
		case DhaagaJsNotificationType.MENTION: {
			return (
				<View>
					<Text>{item.props.id}</Text>
				</View>
			);
		}
		default: {
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
	const realm = useRealm();
	const db = useRealm();
	const accts = db.objects(Account);

	const { translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	const { State, forceUpdate } = useHookLoadingState();
	const { Notifications } = useLandingPageStackApi();

	const NotificationFilters = useRef(new Set(['all']));
	return (
		<WithAutoHideTopNavBar
			title={'Notification Center'}
			translateY={translateY}
		>
			<AnimatedFlashList
				contentContainerStyle={{ paddingTop: 54, paddingHorizontal: 8 }}
				ListHeaderComponent={
					<View>
						<View>
							<Text>Conversations</Text>
						</View>
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
				data={Notifications}
				renderItem={FlashListRenderer}
				getItemType={(o) => o.type}
			/>
		</WithAutoHideTopNavBar>
	);
}

export default LandingPageStack;
