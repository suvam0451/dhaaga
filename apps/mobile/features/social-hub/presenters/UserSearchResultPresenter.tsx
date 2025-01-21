import { AppUserObject } from '../../../types/app-user.types';
import UserPinSearchResultControllerView from '../views/UserPinSearchResultController';
import UserPinSearchResultView from '../views/UserPinSearchResultView';
import { View, StyleSheet } from 'react-native';
import { AppDivider } from '../../../components/lib/Divider';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

type Props = {
	user: AppUserObject;
};

function UserSearchResultPresenter({ user }: Props) {
	const { theme } = useAppTheme();
	function onToggle() {}
	return (
		<View>
			<View style={styles.root}>
				<UserPinSearchResultView user={user} />
				<UserPinSearchResultControllerView active={false} toggle={onToggle} />
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
