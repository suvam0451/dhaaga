import SwipeableTabsContainer from '../../../components/containers/SwipeableTabsContainer';
import MyAccountPage from '../../../components/screens/profile/stack/MyAccountPage';
import AppSettingsPage from '../../../components/screens/profile/stack/AppSettingsPage';

const renderScene = (index: number) => {
	switch (index) {
		case 0:
			return <MyAccountPage />;
		case 1:
			return <AppSettingsPage />;
		default:
			return null;
	}
};

function Page() {
	const tabs = [
		{
			label: 'Account',
			id: 'account',
		},
		{
			label: 'Settings',
			id: 'settings',
		},
	];
	return <SwipeableTabsContainer renderScene={renderScene} pages={tabs} />;
}

export default Page;
