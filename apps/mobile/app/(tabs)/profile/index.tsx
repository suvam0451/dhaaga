import MyAccountPresenter from '../../../features/my-account/presenters/MyAccountPresenter';
import AppSettingsPage from '../../../components/screens/profile/stack/AppSettingsPage';
import { AppPagerView } from '../../../ui/PagerView';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import SelectAccountStack from '#/components/screens/profile/stack/SelectAccount';

const renderScene = (index: number) => {
	switch (index) {
		case 0:
			return <MyAccountPresenter />;
		case 1:
			return <SelectAccountStack />;
		case 2:
			return <AppSettingsPage />;
	}
};

function Page() {
	const { theme } = useAppTheme();

	const labels = [
		{
			label: 'Home',
			id: 'home',
		},
		{
			label: 'Accounts',
			id: 'accounts',
		},
		{
			label: 'Settings',
			id: 'settings',
		},
	];

	return (
		<AppPagerView
			renderScene={renderScene}
			tabCount={3}
			labels={labels}
			showBottomNav
			props={{ backgroundColor: theme.background.a0 }}
		/>
	);
}

export default Page;
