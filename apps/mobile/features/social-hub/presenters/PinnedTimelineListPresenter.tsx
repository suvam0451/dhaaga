import { StyleSheet } from 'react-native';
import { SocialHubPinSectionContainer } from '../../../components/screens/home/stack/landing/fragments/_factory';
import { Account, ProfilePinnedTimeline } from '../../../database/_schema';
import { HubService } from '../../../services/hub.service';
import Animated from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import PinnedTimelineItemView from '../views/PinnedTimelineItemView';

type SocialHubPinnedTimelinesProps = {
	account: Account;
	items: ProfilePinnedTimeline[];
};

function PinnedTimelineListPresenter({
	items,
	account,
}: SocialHubPinnedTimelinesProps) {
	const destinations = HubService.resolveTimelineDestinations(items);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	return (
		<SocialHubPinSectionContainer
			label={t(`hub.section.feeds`, { ns: LOCALIZATION_NAMESPACE.CORE })}
			style={styles.root}
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
		</SocialHubPinSectionContainer>
	);
}

export default PinnedTimelineListPresenter;

const styles = StyleSheet.create({
	root: {
		marginTop: 16,
		marginHorizontal: 8,
	},
});
