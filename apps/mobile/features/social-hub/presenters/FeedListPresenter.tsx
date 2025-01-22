import { StyleSheet } from 'react-native';
import { Account, ProfilePinnedTimeline } from '../../../database/_schema';
import { HubService } from '../../../services/hub.service';
import Animated from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import PinnedTimelineItemView from '../views/PinnedTimelineItemView';
import HubTabSectionContainer from '../components/HubTabSectionContainer';
import { useAppBottomSheet_Improved } from '../../../hooks/utility/global-state-extractors';
import { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';

type SocialHubPinnedTimelinesProps = {
	account: Account;
	items: ProfilePinnedTimeline[];
};

function FeedListPresenter({ items, account }: SocialHubPinnedTimelinesProps) {
	const destinations = HubService.resolveTimelineDestinations(items);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const { show } = useAppBottomSheet_Improved();

	function onPressAdd() {
		show(APP_BOTTOM_SHEET_ENUM.ADD_HUB_FEED, true);
	}

	return (
		<HubTabSectionContainer
			label={t(`hub.section.feeds`)}
			style={styles.root}
			onPressAdd={onPressAdd}
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
