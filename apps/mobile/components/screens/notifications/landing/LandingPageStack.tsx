import { useRealm } from '@realm/react';
import { Account } from '../../../../entities/account.entity';
import { ScrollView, View } from 'react-native';
import AppButtonGroup from '../../../lib/ButtonGroups';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import ControlSegment from '../../../widgets/feed-controller/components/ControlSegment';
import { Text } from '@rneui/themed';
import selection from '../../../../app/(tabs)/accounts/selection';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import useLandingPageStackApi, { AppNotificationGroup } from './api';
import { useEffect } from 'react';
import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { NotificationType } from '@dhaaga/shared-abstraction-activitypub';

interface MentionItem {
	props: AppNotificationGroup;
	type: NotificationType.MENTION;
}

type ListItem = MentionItem;

function FlashListRenderer({ item }: { item: ListItem }) {
	switch (item.type) {
		case NotificationType.MENTION: {
			return (
				<View>
					<Text>{item.props.id}</Text>
				</View>
			);
		}
		default: {
			return (
				<View>
					<Text>Notification Type not handled</Text>
				</View>
			);
		}
	}
}

function LandingPageStack() {
	const { primaryAcct, client } = useActivityPubRestClientContext();

	const realm = useRealm();
	const db = useRealm();
	const accts = db.objects(Account);

	function onInteractionFilterChange(idx: number) {}

	function onSocialGraphFilterChange(idx: number) {}

	const { onScroll, translateY, resetPosition } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	const { Notifications } = useLandingPageStackApi();

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
							label={'User Interactions'}
							buttons={[
								{
									selected: true,
									label: 'All',
									onClick: () => {},
								},
								{
									selected: false,
									label: 'Mentions',
									onClick: () => {},
								},
								{
									selected: false,
									label: 'Boosts',
									onClick: () => {},
								},
								{
									selected: false,
									label: 'Favourites',
									onClick: () => {},
								},
								{
									selected: false,
									label: 'None',
									onClick: () => {},
								},
							]}
						/>

						<ControlSegment
							label={'Social Links'}
							buttons={[
								{
									selected: true,
									label: 'All',
									onClick: () => {},
								},
								{
									selected: false,
									label: 'Follow',
									onClick: () => {},
								},
								{
									selected: false,
									label: 'Requests',
									onClick: () => {},
								},
								{
									selected: false,
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
