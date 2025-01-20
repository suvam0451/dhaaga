import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';

function Header() {
	return (
		<AppTabLandingNavbar
			type={APP_LANDING_PAGE_TYPE.DISCOVER}
			menuItems={[
				{
					iconId: 'layers-outline',
					onPress: () => {},
				},
				{
					iconId: 'user-guide',
					onPress: () => {
						router.navigate(APP_ROUTING_ENUM.GUIDE_DISCOVER_TAB);
					},
				},
			]}
		/>
	);
}

export default Header;
