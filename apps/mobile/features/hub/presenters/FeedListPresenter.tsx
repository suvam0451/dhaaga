import { FlatList, StyleSheet } from 'react-native';
import { Account, ProfilePinnedTimeline } from '@dhaaga/db';
import { HubService } from '#/services/hub.service';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import PinnedTimelineItemView from '../views/PinnedTimelineItemView';
import HubTabSectionContainer from '../components/HubTabSectionContainer';

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
