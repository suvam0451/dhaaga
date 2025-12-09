import { useSocialHubFeedPinStatus } from '#/features/social-hub/api/useSocialHubFeedPinStatus';
import { Profile } from '@dhaaga/db';
import { useProfileMutation } from '#/features/app-profiles/api/useProfileMutation';
import { StyleSheet, View } from 'react-native';
import UserPinSearchResultControllerView from '#/features/social-hub/views/UserPinSearchResultController';
import { AppDivider } from '../../lib/Divider';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import FeedPinSearchResultView from '#/features/social-hub/views/FeedPinSearchResultView';
import type { FeedObjectType } from '@dhaaga/bridge';

type Props = {
	profile: Profile;
	feed: FeedObjectType;
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
