import { StyleSheet } from 'react-native';
import { Account, ProfilePinnedTimeline } from '@dhaaga/db';
import { HubService } from '../../../services/hub.service';
import Animated from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import PinnedTimelineItemView from '../views/PinnedTimelineItemView';
import HubTabSectionContainer from '../components/HubTabSectionContainer';
import { useAppBottomSheet } from '../../../hooks/utility/global-state-extractors';
import { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';

type SocialHubPinnedTimelinesProps = {
	account: Account;
	items: ProfilePinnedTimeline[];
	onPressAddFeed: () => void;
};

function FeedListPresenter({
	items,
	account,
	onPressAddFeed,
}: SocialHubPinnedTimelinesProps) {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const destinations = HubService.resolveTimelineDestinations(t, items);

	return (
		<HubTabSectionContainer
			label={t(`hub.section.feeds`)}
			style={styles.root}
			onPressAdd={onPressAddFeed}
		>
			<Animated.FlatList
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
		</HubTabSectionContainer>
	);
}

export default FeedListPresenter;

const styles = StyleSheet.create({
	root: {
		marginTop: 16,
		marginHorizontal: 8,
	},
});
