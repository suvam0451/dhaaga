import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';

type Props = {
	type: APP_LANDING_PAGE_TYPE;
};

function Header({ type }: Props) {
	let menuItems = [
		{
			iconId: 'user-guide',
			onPress: () => {
				router.navigate(APP_ROUTING_ENUM.INBOX_GUIDE);
			},
		},
	];
	if (type === APP_LANDING_PAGE_TYPE.CHAT) {
		menuItems = [
			{
				iconId: 'add',
				onPress: () => {},
			},
			...menuItems,
		];
	}
	if (type === APP_LANDING_PAGE_TYPE.UPDATES) {
		menuItems = [
			{
				iconId: 'notifications-outline',
				onPress: () => {
					router.navigate(APP_ROUTING_ENUM.INBOX_MANAGE_SUBSCRIPTIONS);
				},
			},
			...menuItems,
		];
	}
	return <AppTabLandingNavbar type={type} menuItems={menuItems as any} />;
}

export default Header;
