import MyAccountPresenter from '../../../features/my-account/presenters/MyAccountPresenter';
import AppSettingsPage from '../../../components/screens/profile/stack/AppSettingsPage';
import { AppPagerView } from '../../../ui/PagerView';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

const renderScene = (index: number) => {
	switch (index) {
		case 0:
			return <MyAccountPresenter />;
		case 1:
			return <AppSettingsPage />;
	}
};

function Page() {
	const { theme } = useAppTheme();

	const labels = [
		{
			label: 'Account',
			id: 'account',
		},
		{
			label: 'Settings',
			id: 'settings',
		},
	];

	return (
		<AppPagerView
			renderScene={renderScene}
			tabCount={2}
			labels={labels}
			showBottomNav
			props={{ backgroundColor: theme.background.a0 }}
		/>
	);
}

export default Page;
