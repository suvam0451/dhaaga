import { AppPagerView } from '#/ui/PagerView';
import { useAppTheme } from '#/states/global/hooks';
import MyHome from '#/features/home/MyHome';
import AccountManagement from '#/features/manage-accounts/AccountManagement';
import AppSettings from '#/features/settings/AppSettings';

const renderScene = (index: number) => {
	switch (index) {
		case 0:
			return <MyHome />;
		case 1:
			return <AccountManagement />;
		case 2:
			return <AppSettings />;
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
			scrollEnabled={false}
		/>
	);
}

export default Page;
