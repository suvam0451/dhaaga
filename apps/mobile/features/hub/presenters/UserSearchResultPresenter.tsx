import UserPinSearchResultControllerView from '../views/UserPinSearchResultController';
import UserPinSearchResultView from '../views/UserPinSearchResultView';
import { View, StyleSheet } from 'react-native';
import { useProfileMutation } from '../api/useProfileMutation';
import { Profile } from '@dhaaga/db';
import { useSocialHubUserPinStatus } from '../api/useSocialHubUserPinStatus';
import type { UserObjectType } from '@dhaaga/bridge';

type Props = {
	profile: Profile;
	user: UserObjectType;
	onChangeCallback: () => void;
};

function UserSearchResultPresenter({ profile, user, onChangeCallback }: Props) {
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
		<View style={styles.root}>
			<UserPinSearchResultView user={user} />
			<UserPinSearchResultControllerView active={data} toggle={onToggle} />
		</View>
	);
}

export default UserSearchResultPresenter;

const styles = StyleSheet.create({
	root: {
		flexDirection: 'row',
		paddingLeft: 4,
		paddingRight: 12,
		alignItems: 'center',
	},
});
