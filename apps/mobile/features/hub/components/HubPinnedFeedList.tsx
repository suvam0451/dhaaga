import { FlatList } from 'react-native';
import { Account, ProfilePinnedTimeline } from '@dhaaga/db';
import { HubService } from '#/services/hub.service';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import PinnedTimelineItemView from '../views/PinnedTimelineItemView';
import HubPinSectionContainer from './HubPinSectionContainer';

type SocialHubPinnedTimelinesProps = {
	account: Account;
	items: ProfilePinnedTimeline[];
	onPressAddFeed: () => void;
};

function HubPinnedFeedList({
	items,
	account,
	onPressAddFeed,
}: SocialHubPinnedTimelinesProps) {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const destinations = HubService.resolveTimelineDestinations(t, items);

	return (
		<HubPinSectionContainer
			label={t(`hub.section.feeds`)}
			style={{
				marginTop: 8,
			}}
			onPressAdd={onPressAddFeed}
		>
			<FlatList
				data={destinations}
				numColumns={2}
				horizontal={false}
				renderItem={({ item }) => (
					<PinnedTimelineItemView
						pinId={item.pinId}
						label={item.label}
						iconId={item.iconId}
						server={item.server}
						account={account}
						avatar={item.avatar}
					/>
				)}
			/>
		</HubPinSectionContainer>
	);
}

export default HubPinnedFeedList;
