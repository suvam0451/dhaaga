import UserPinSearchResultControllerView from '../views/UserPinSearchResultController';
import UserPinSearchResultView from '../views/UserPinSearchResultView';
import { View, StyleSheet } from 'react-native';
import { AppDivider } from '#/components/lib/Divider';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import { useProfileMutation } from '../../app-profiles/api/useProfileMutation';
import { Profile } from '@dhaaga/db';
import { useSocialHubUserPinStatus } from '../api/useSocialHubUserPinStatus';
import type { UserObjectType } from '@dhaaga/bridge/typings';

type Props = {
	profile: Profile;
	user: UserObjectType;
	onChangeCallback: () => void;
};

function UserSearchResultPresenter({ profile, user, onChangeCallback }: Props) {
	const { theme } = useAppTheme();
	const { data, refetch } = useSocialHubUserPinStatus(profile, user);
	const { toggleUserPin } = useProfileMutation();
	function onToggle() {
		toggleUserPin
			.mutateAsync({
				user,
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
				<UserPinSearchResultView user={user} />
				<UserPinSearchResultControllerView active={data} toggle={onToggle} />
			</View>
			<AppDivider.Hard
				style={{ marginVertical: 8, backgroundColor: theme.background.a40 }}
			/>
		</View>
	);
}

export default UserSearchResultPresenter;

const styles = StyleSheet.create({
	root: {
		flexDirection: 'row',
		paddingLeft: 4,
		paddingRight: 12,
	},
});
