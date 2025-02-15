import { useSocialHubFeedPinStatus } from '../api/useSocialHubFeedPinStatus';
import { Profile } from '../../../database/_schema';
import { AppFeedObject } from '../../../types/app-feed.types';
import { useProfileMutation } from '../../app-profiles/api/useProfileMutation';
import { StyleSheet, View } from 'react-native';
import UserPinSearchResultControllerView from '../views/UserPinSearchResultController';
import { AppDivider } from '../../../components/lib/Divider';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import FeedPinSearchResultView from '../views/FeedPinSearchResultView';

type Props = {
	profile: Profile;
	feed: AppFeedObject;
	onChangeCallback: () => void;
};

function FeedSearchResultPresenter({ profile, feed, onChangeCallback }: Props) {
	const { theme } = useAppTheme();
	const { toggleFeedPin } = useProfileMutation();
	const { data, refetch } = useSocialHubFeedPinStatus(profile, feed);
	function onToggle() {
		toggleFeedPin
			.mutateAsync({
				feed,
				profile,
			})
			.finally(() => {
				refetch();
				if (onChangeCallback) onChangeCallback();
			});
	}

	return (
		<View>
			<View style={styles.root}>
				<FeedPinSearchResultView feed={feed} />
				<UserPinSearchResultControllerView active={data} toggle={onToggle} />
			</View>
			<AppDivider.Hard
				style={{ marginVertical: 8, backgroundColor: theme.background.a40 }}
			/>
		</View>
	);
}

export default FeedSearchResultPresenter;

const styles = StyleSheet.create({
	root: {
		flexDirection: 'row',
		paddingLeft: 4,
		paddingRight: 12,
	},
});
