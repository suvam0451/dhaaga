import { RefreshControl, ScrollView } from 'react-native';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type SocialHubTabContainerProps = {
	refreshing: boolean;
	onRefresh: () => void;
};

function SocialHubTabContainer({
	refreshing,
	onRefresh,
}: SocialHubTabContainerProps) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
			acct: o.acct,
			loadActiveProfile: o.loadActiveProfile,
		})),
	);

	return (
		<ScrollView
			style={{
				backgroundColor: theme.palette.bg,
				height: '100%',
			}}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		></ScrollView>
	);
}

export default SocialHubTabContainer;
